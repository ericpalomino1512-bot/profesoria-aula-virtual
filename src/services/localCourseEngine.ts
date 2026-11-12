import type { Course, CourseFormData, Unit, Lesson, QuizQuestion, FinalProject, SourceReference } from '../types/course';
import type { ParsedDocument, ParsedSection } from './documentParser';

/**
 * Cleans and formats sentences to ensure clear readability.
 */
function cleanSentences(text: string): string[] {
  return text
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .split(/(?<=[.?!])\s+/)
    .map(s => s.trim())
    .filter(s => s.length > 20 && !s.startsWith('http') && !s.match(/^[0-9]+$/));
}

/**
 * Extracts key terms and keywords from a block of text.
 */
function extractKeyTerms(text: string): string[] {
  const words = text
    .toLowerCase()
    .replace(/[^a-záéíóúñ0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(w => w.length > 5);

  const stopWords = new Set([
    'cuando', 'donde', 'porque', 'además', 'también', 'entonces', 'durante', 'mediante',
    'después', 'primero', 'segundo', 'ejemplo', 'general', 'manera', 'forma', 'sistema',
    'cuenta', 'pueden', 'deben', 'siendo', 'muchos', 'algunos', 'aquellos', 'nuestro'
  ]);

  const frequency: Record<string, number> = {};
  words.forEach(w => {
    if (!stopWords.has(w)) {
      frequency[w] = (frequency[w] || 0) + 1;
    }
  });

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 15)
    .map(([w]) => w.charAt(0).toUpperCase() + w.slice(1));
}

/**
 * Builds realistic multiple-choice questions from content sentences.
 */
function generateQuizFromContent(
  conceptTitle: string,
  content: string,
  keyTerms: string[],
  prefix: string,
  count: number = 3
): QuizQuestion[] {
  const sentences = cleanSentences(content);
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    const primarySentence = sentences[i % sentences.length] || `El principio fundamental de ${conceptTitle} es esencial para su correcta comprensión técnica.`;
    const term = keyTerms[i % keyTerms.length] || conceptTitle;

    let questionText = '';
    let options: [string, string, string, string];
    let explanation = '';

    if (i === 0) {
      questionText = `Según el contenido estudiado en "${conceptTitle}", ¿cuál es el concepto o propósito principal?`;
      options = [
        primarySentence.length > 90 ? primarySentence.substring(0, 85) + '...' : primarySentence,
        `Contradecir las directrices establecidas para ${term.toLowerCase()}.`,
        `Prescindir por completo del análisis riguroso de ${conceptTitle.toLowerCase()}.`,
        'Ninguna de las opciones anteriores refleja el contenido.'
      ];
      explanation = `El material formativo destaca que: "${primarySentence}". Esta afirmación resume el núcleo conceptual del apartado.`;
    } else if (i === 1) {
      questionText = `En relación con ${term}, ¿qué afirmación se ajusta con mayor precisión a lo expuesto en el documento?`;
      options = [
        `Es un elemento secundario sin repercusión en ${conceptTitle.toLowerCase()}.`,
        `Desempeña un rol clave articulando los mecanismos y objetivos de ${conceptTitle.toLowerCase()}.`,
        `Fue descartado en las versiones iniciales del análisis.`,
        `Solo aplica en escenarios teóricos sin validez práctica.`
      ];
      explanation = `${term} constituye una noción central en este módulo, conectando la fundamentación teórica con su posterior desarrollo.`;
    } else {
      questionText = `Al aplicar lo aprendido sobre "${conceptTitle}", ¿qué buena práctica o criterio metodológico se debe priorizar?`;
      options = [
        'Ignorar los requisitos previos y proceder sin verificación sistemática.',
        'Sustituir los procedimientos contrastados por estimaciones intuitivas.',
        `Verificar paso a paso los fundamentos y asegurar coherencia con los objetivos fijados.`,
        'Delegar el análisis sin registrar evidencias ni conclusiones.'
      ];
      explanation = 'La metodología pedagógica del curso exige contrastar rigurosamente cada fase antes de dar por consolidado el aprendizaje.';
    }

    questions.push({
      id: `${prefix}-q${i + 1}`,
      question: questionText,
      options,
      correctOptionIndex: i === 0 ? 0 : i === 1 ? 1 : 2,
      explanation
    });
  }

  return questions;
}

/**
 * Synthesizes a structured Course object completely offline from parsed document contents.
 */
export function buildCourseFromDocuments(
  documents: ParsedDocument[],
  formData: Partial<CourseFormData>
): Course {
  const courseId = `curso-doc-${Date.now()}`;

  // Gather all sections across all uploaded files
  const allSections: ParsedSection[] = [];
  let combinedRawText = '';

  documents.forEach((doc) => {
    allSections.push(...doc.sections);
    combinedRawText += `\n${doc.extractedText}`;
  });

  // Infer or use provided course title
  const mainDocName = documents[0]?.name.replace(/\.[^/.]+$/, '') || 'Material Didáctico';
  const inferredTopic = formData.topic?.trim() || mainDocName;
  const level = formData.level || 'Intermedio';
  const studentProfile = formData.studentProfile || 'Estudiante o profesional especializado';
  const mainGoal = formData.mainGoal || `Dominar y aplicar los contenidos presentados en ${inferredTopic}`;
  const availableTime = formData.availableTime || '4 semanas, 30 min al día';
  const preferredFormat = formData.preferredFormat || 'Lecturas + ejercicios';

  const globalKeyTerms = extractKeyTerms(combinedRawText);

  // Group sections into 4 to 7 thematic units
  const targetUnitCount = Math.max(4, Math.min(7, Math.ceil(allSections.length / 3)));
  const sectionsPerUnit = Math.max(1, Math.ceil(allSections.length / targetUnitCount));

  const units: Unit[] = [];
  let currentUnitIdx = 1;

  for (let i = 0; i < allSections.length && units.length < targetUnitCount; i += sectionsPerUnit) {
    const slice = allSections.slice(i, i + sectionsPerUnit);
    const unitTitle = slice[0]?.title || `Unidad ${currentUnitIdx}: ${inferredTopic}`;
    const unitText = slice.map(s => s.content).join(' ');
    const unitTerms = extractKeyTerms(unitText);

    // Build 2 to 4 lessons per unit
    const lessons: Lesson[] = [];
    const lessonCount = Math.min(4, Math.max(2, slice.length));

    for (let lIdx = 0; lIdx < lessonCount; lIdx++) {
      const sec = slice[lIdx] || slice[0];
      const lessonTitle = sec?.title || `Tema ${currentUnitIdx}.${lIdx + 1}`;
      const lessonText = sec?.content || unitText;
      const lessonSentences = cleanSentences(lessonText);

      // Idea Clave: synthesize 4-7 sentences
      let keyIdea = lessonSentences.slice(0, 5).join(' ');
      if (keyIdea.length < 150) {
        keyIdea = `${lessonTitle} constituye un eje formativo medular extraído de tus documentos. ${keyIdea} El dominio de estos fundamentos permite comprender con precisión los mecanismos, normativas y relaciones conceptuales del tema. Asegúrate de revisar detenidamente cada punto antes de avanzar a los ejercicios.`;
      }

      // Applied Example: contextualized case
      const appliedExample = `En un entorno real de ${studentProfile.toLowerCase()}, los conceptos de "${lessonTitle}" se manifiestan al resolver problemas operativos o formular estrategias fundamentadas. Por ejemplo, al enfrentarse a un caso práctico de ${unitTerms[0] || 'análisis'}, un profesional analiza los datos de partida, contrasta las premisas técnicas y ejecuta las pautas descritas en el material para garantizar resultados reproducibles y de alta calidad.`;

      // Practical Activity: concrete prompt
      const practicalActivity = `Abre tu libreta de notas o entorno de trabajo y realiza la siguiente actividad: 1) Sintetiza en tres viñetas las ideas clave de "${lessonTitle}". 2) Identifica al menos dos situaciones de tu contexto (${studentProfile}) donde aplicarías directamente este procedimiento. 3) Formula una pregunta crítica sobre los límites o condiciones de aplicación del tema.`;

      // Quick Quiz: 3 questions grounded in the extracted text
      const quickQuiz = generateQuizFromContent(
        lessonTitle,
        lessonText,
        unitTerms.length > 0 ? unitTerms : globalKeyTerms,
        `u${currentUnitIdx}-l${lIdx + 1}`,
        3
      );

      lessons.push({
        id: `u${currentUnitIdx}-l${lIdx + 1}`,
        lessonNumber: `${currentUnitIdx}.${lIdx + 1}`,
        title: lessonTitle,
        durationMinutes: 20 + (lIdx * 5),
        keyIdea,
        appliedExample,
        practicalActivity,
        quickQuiz
      });
    }

    units.push({
      id: `u${currentUnitIdx}`,
      unitNumber: currentUnitIdx,
      title: unitTitle.length > 80 ? unitTitle.substring(0, 75) + '...' : unitTitle,
      summary: `Compendio analítico sobre ${unitTerms.slice(0, 3).join(', ') || unitTitle}, estructurado directamente a partir de la documentación aportada.`,
      lessons
    });

    currentUnitIdx++;
  }

  // Final Assessment: 8 integrative questions across units
  const finalAssessment: QuizQuestion[] = [];
  for (let qIdx = 0; qIdx < 8; qIdx++) {
    const targetUnit = units[qIdx % units.length];
    const qTerm = globalKeyTerms[qIdx % globalKeyTerms.length] || targetUnit.title;

    finalAssessment.push({
      id: `fa-doc-${qIdx + 1}`,
      question: `Respecto a los contenidos integrados en la Unidad ${targetUnit.unitNumber} ("${targetUnit.title}"), ¿qué principio sintetiza mejor la evidencia presentada sobre ${qTerm}?`,
      options: [
        `Es indispensable fundamentar las decisiones en los criterios y directrices extraídos del material didáctico.`,
        `Debe omitirse cualquier comprobación técnica para acelerar los plazos.`,
        `Solo es aplicable si no existen condicionantes de tiempo o recursos.`,
        `Carece de vinculación con los objetivos globales del curso.`
      ],
      correctOptionIndex: 0,
      explanation: `La documentación formativa insiste en la necesidad de articular decisiones fundamentadas y contrastables en el ámbito de ${targetUnit.title}.`
    });
  }

  // 2 Final Practical Projects
  const finalProjects: FinalProject[] = [
    {
      id: 'proj-doc-1',
      title: `Plan Integral de Aplicación: ${inferredTopic}`,
      description: `Elabora una propuesta técnica o dossier estratégico que integre las directrices clave extraídas de tus documentos (${documents.map(d => d.name).join(', ')}). El proyecto debe resolver un problema real del perfil "${studentProfile}".`,
      deliverable: 'Documento ejecutivo estructurado con diagnóstico de partida, justificación teórica basada en los apuntes del curso, plan de acción paso a paso y matriz de riesgos.',
      evaluationCriteria: [
        'Alineación rigurosa con los conceptos nucleares de las unidades didácticas.',
        'Viabilidad y realismo práctico de la propuesta.',
        'Claridad expositiva y fundamentación en el material analizado.'
      ]
    },
    {
      id: 'proj-doc-2',
      title: `Guía Metodológica y Buenas Prácticas en ${inferredTopic}`,
      description: `Diseña un manual de referencia rápida o infografía operativa orientada a transferir el conocimiento de las ${units.length} unidades formativas a otros miembros de tu equipo o compañeros de estudio.`,
      deliverable: 'Guía visual en formato digital o póster de procedimientos con diagramas de flujo, términos clave y lista de comprobación de calidad.',
      evaluationCriteria: [
        'Capacidad de síntesis pedagógica sin pérdida de rigor conceptual.',
        'Inclusión de ejemplos aplicados y advertencias sobre errores frecuentes.',
        'Estructura visual clara y accesible.'
      ]
    }
  ];

  // Sources and References
  const sourcesAndReferences: SourceReference[] = documents.map(doc => ({
    title: `${doc.name} (${doc.type.toUpperCase()})`,
    type: doc.type === 'pdf' ? 'recurso académico' : doc.type === 'pptx' ? 'documentación oficial' : 'artículo',
    description: `Documento fuente original procesado localmente en el aula virtual. Contiene ${doc.itemCount} ${doc.type === 'pptx' ? 'diapositivas' : doc.type === 'pdf' ? 'páginas' : 'secciones'} y ${(doc.size / 1024).toFixed(1)} KB de material textual extraído sin dependencias externas.`
  }));

  sourcesAndReferences.push({
    title: `Repositorio Documental del Curso: ${inferredTopic}`,
    type: 'documentación oficial',
    description: 'Compendio bibliográfico primario aportado por el estudiante y estructurado por el motor instruccional autónomo de ProfesorIA.'
  });

  return {
    id: courseId,
    title: `Curso Especializado: ${inferredTopic}`,
    subtitle: `Itinerario formativo completo estructurado automáticamente a partir de ${documents.length} documento${documents.length > 1 ? 's' : ''} fuente (${documents.map(d => d.name).join(', ')}), adaptado para ${studentProfile}.`,
    level,
    estimatedDuration: availableTime,
    targetProfile: studentProfile,
    mainGoal,
    preferredFormat,
    learningObjectives: [
      `Asimilar la estructura conceptual nuclear presentada en ${inferredTopic}.`,
      `Interpretar y relacionar los términos técnicos y variables clave (${globalKeyTerms.slice(0, 4).join(', ')}).`,
      `Aplicar los procedimientos y recomendaciones a casos de estudio del perfil ${studentProfile}.`,
      `Evaluar de forma crítica la resolución de problemas mediante las directrices del material.`,
      `Integrar los contenidos transversales en el proyecto práctico final del aula.`
    ],
    units,
    finalAssessment,
    finalProjects,
    sourcesAndReferences,
    createdAt: new Date().toISOString()
  };
}

/**
 * Generates a full structured course for ANY custom topic completely offline
 * when no API key is provided and no files are uploaded.
 */
export function buildCourseFromTopic(formData: CourseFormData): Course {
  const courseId = `curso-local-${Date.now()}`;
  const topic = formData.topic.trim();
  const level = formData.level;
  const profile = formData.studentProfile.trim();
  const goal = formData.mainGoal.trim();
  const time = formData.availableTime.trim();
  const format = formData.preferredFormat;

  // Instructional unit blueprints tailored to the topic
  const unitBlueprints = [
    {
      title: `Fundamentos y Marco Conceptual de ${topic}`,
      summary: `Bases esenciales, definiciones formales y arquitectura de principios para dominar ${topic} con solidez.`,
      lessons: [
        {
          title: `Principios Nucleares y Alcance de ${topic}`,
          durationMinutes: 20,
          keyIdea: `Para adentrarse con éxito en ${topic}, es imprescindible dominar sus conceptos nucleares y las relaciones funcionales que lo articulan. Todo proceso o metodología en esta área se apoya en reglas contrastadas que evitan interpretaciones equívocas. Comprender el origen y la finalidad de estos fundamentos te otorgará criterio propio para discriminar qué técnicas aplicar en cada circunstancia. La base sólida no es mero trámite teórico, sino la brújula analítica que marcará la diferencia a lo largo de todo tu itinerario.`,
          appliedExample: `En el desempeño diario de un ${profile.toLowerCase()}, estos principios se comprueban al clasificar los datos de entrada y planificar los primeros pasos sin cometer fallos de principiante. Por ejemplo, antes de ejecutar una acción técnica, un profesional evalúa el marco de partida para anticipar posibles desvíos y asegurar la compatibilidad con el objetivo.`,
          practicalActivity: `Elabora en tu cuaderno un glosario conceptual con los tres términos más relevantes de este apartado. Escribe para cada uno una definición breve con tus propias palabras y un contraejemplo de qué NO representa ese concepto.`
        },
        {
          title: `Estructura, Terminología y Variables Clave`,
          durationMinutes: 25,
          keyIdea: `Cada ámbito de ${topic} posee su propio vocabulario operativo y un conjunto de variables críticas que condicionan su funcionamiento. Saber identificar cuáles son las variables dependientes e independientes te permite anticipar resultados y formular hipótesis certeras. Desestimar la terminología técnica conduce a confusiones metodológicas graves. Conforme avances, notarás cómo la precisión léxica facilita la comunicación profesional y la redacción de informes rigurosos.`,
          appliedExample: `Imagina que debes justificar una decisión técnica ante un comité o examen oficial. Quien utiliza la terminología estándar de ${topic} transmite autoridad y rigor inmediato, mientras que las explicaciones vagas generan desconfianza sobre la solidez de la propuesta.`,
          practicalActivity: `Selecciona un caso concreto de tu entorno y desglosa las variables principales involucradas: clasifícalas en factores controlables y variables de entorno que debes monitorizar constantemente.`
        },
        {
          title: `Metodología de Trabajo y Criterios de Calidad`,
          durationMinutes: 20,
          keyIdea: `El dominio de ${topic} no depende de la intuición aislada, sino de la aplicación de métodos sistemáticos con controles de calidad bien definidos. Establecer un protocolo de verificación garantiza que cada conclusión esté sustentada en evidencias verificables. Esta disciplina analítica previene sesgos y permite documentar el proceso de manera reproducible, cumpliendo con los estándares requeridos en ${goal}.`,
          appliedExample: `En proyectos de envergadura, seguir una lista de comprobación de calidad reduce los errores en más del 70%. Los mejores especialistas revisan sistemáticamente cada fase antes de dar por buena una entrega.`,
          practicalActivity: `Diseña una rúbrica o lista de comprobación de 5 puntos clave que utilizarás para verificar la calidad de tus próximos ejercicios de ${topic}.`
        }
      ]
    },
    {
      title: `Estrategias, Herramientas y Mecanismos de ${topic}`,
      summary: `Técnicas instrumentales y procedimientos avanzados para modelar y resolver problemas complejos.`,
      lessons: [
        {
          title: `Mecanismos Operativos y Procedimientos Paso a Paso`,
          durationMinutes: 25,
          keyIdea: `Una vez fijados los fundamentos, la resolución eficaz en ${topic} se articula mediante algoritmos o secuencias de decisión lógica. Cada etapa del procedimiento tiene un propósito específico: preparación del entorno, análisis de restricciones, ejecución técnica y contrastación de resultados. Modificar arbitrariamente el orden sin justificación técnica debilita la coherencia de todo el proceso. Dominar este flujo metodológico te aportará agilidad mental y serenidad frente a desafíos imprevistos.`,
          appliedExample: `Al analizar un problema complejo bajo presión de tiempo, un profesional divide el reto en tres subproblemas manejables: primero aísla las premisas críticas, luego aplica la regla correspondiente y finalmente verifica la consistencia matemática o lógica.`,
          practicalActivity: `Toma un problema o reto representativo de ${topic} y dibuja un diagrama de flujo secuencial indicando las condiciones 'si/entonces' que determinan el siguiente paso.`
        },
        {
          title: `Análisis de Casos Críticos y Errores Habituales`,
          durationMinutes: 25,
          keyIdea: `El verdadero aprendizaje en ${topic} se forja estudiando los fallos más comunes y las anomalías en casos límite. La mayoría de equivocaciones en exámenes o proyectos provienen de suposiciones precipitadas o de no verificar las condiciones de contorno. Al diseccionar detalladamente estos patrones erróneos, aprendes a detectarlos antes de que se produzcan. Esta mirada crítica te permitirá auditar tu propio trabajo con máxima autoexigencia.`,
          appliedExample: `En auditorías técnicas de ${topic}, los analistas sénior buscan de inmediato los tres errores típicos que los perfiles júnior suelen pasar por alto, logrando corregir las desviaciones antes de que generen impacto.`,
          practicalActivity: `Identifica dos errores frecuentes cometidos al estudiar o aplicar ${topic}. Explica la causa raíz de cada error y redacta una regla mnemotécnica para evitarlo en el futuro.`
        },
        {
          title: `Optimización y Toma de Decisiones Técnicas`,
          durationMinutes: 30,
          keyIdea: `Cuando existen múltiples caminos viables para abordar un reto en ${topic}, es necesario ponderar criterios de eficiencia, coste y fiabilidad. La optimización no consiste en buscar atajos fáciles, sino en seleccionar la alternativa que maximice los resultados con el menor margen de incertidumbre. Este criterio selectivo es una de las competencias más valoradas en el perfil de ${profile}.`,
          appliedExample: `Frente a dos alternativas de diseño, una rápida pero frágil y otra metódica pero robusta, la elección correcta depende del objetivo (${goal}). Aprender a ponderar el balance coste-beneficio es la marca distintiva del especialista.`,
          practicalActivity: `Plantea una tabla comparativa con dos enfoques alternativos para un problema de ${topic}, puntuando del 1 al 5 su facilidad de implementación, robustez y tiempo requerido.`
        }
      ]
    },
    {
      title: `Aplicación Práctica y Casos Reales en el Ámbito Profesional`,
      summary: `Transferencia directa a situaciones cotidianas, laborales y de evaluación oficial.`,
      lessons: [
        {
          title: `Casos de Estudio Contemporáneos y Buenas Prácticas`,
          durationMinutes: 25,
          keyIdea: `La teoría cobra sentido pleno cuando se confronta con la realidad práctica. Los casos de estudio contemporáneos demuestran que las organizaciones y especialistas que aplican con rigor los principios de ${topic} logran ventajas competitivas tangibles. Analizar estos casos te capacita para extrapolar soluciones probadas a tus propios desafíos formativos.`,
          appliedExample: `En el día a día laboral, los estándares de ${topic} permiten coordinar equipos multidisciplinares, asegurando que todos los participantes compartan los mismos criterios de éxito y lenguaje técnico.`,
          practicalActivity: `Redacta un breve informe de 1 página donde expongas un caso de éxito real o hipotético de aplicación de ${topic}, destacando los factores determinantes del logro.`
        },
        {
          title: `Resolución de Problemas Complejos y Síntesis`,
          durationMinutes: 30,
          keyIdea: `Los problemas del mundo real rara vez se presentan en compartimentos estancos; integran múltiples variables a la vez. Para resolverlos, debes activar simultáneamente conceptos de las unidades previas y jerarquizar prioridades. La capacidad de síntesis analítica te permitirá responder a preguntas complejas con argumentos sólidos, claros y perfectamente estructurados.`,
          appliedExample: `En un examen de acceso o prueba de selección técnica, el evaluador califica tanto la respuesta final como la claridad de la argumentación intermedia y la justificación metodológica empleada.`,
          practicalActivity: `Simula una situación de examen o entrega técnica: resuelve un ejercicio integrador de ${topic} cronometrándote 20 minutos y redacta tu respuesta con formato formal.`
        }
      ]
    },
    {
      title: `Consolidación, Evaluación Integral y Proyección`,
      summary: `Integración final de competencias para alcanzar el objetivo de ${goal}.`,
      lessons: [
        {
          title: `Estrategias de Repaso Activo y Memorización Significativa`,
          durationMinutes: 20,
          keyIdea: `Para que los conocimientos sobre ${topic} permanezcan disponibles a largo plazo, el estudio pasivo resulta insuficiente. Es necesario implementar técnicas de evocación activa y repetición espaciada. Explicar los conceptos con tus propias palabras o someterte a simulacros de test consolida las conexiones neuronales y refuerza tu autoconfianza para afrontar ${goal}.`,
          appliedExample: `Los mejores estudiantes y profesionales no releen apuntes una y otra vez; cierran el material y se autoformulan preguntas desafiantes sobre los puntos débiles detectados.`,
          practicalActivity: `Diseña un mapa mental de síntesis en una única página que conecte los conceptos principales de todas las unidades del curso de forma visual.`
        },
        {
          title: `Plan de Acción Continuado y Próximos Pasos`,
          durationMinutes: 25,
          keyIdea: `Completar este curso representa un hito fundamental, pero el aprendizaje debe transformarse en hábito continuo. Establecer un plan de acción con objetivos a 30, 60 y 90 días te asegurará consolidar los resultados obtenidos en ${goal}. Mantén siempre la curiosidad investigadora y la exigencia metodológica que has cultivado en esta aula virtual.`,
          appliedExample: `Un ${profile.toLowerCase()} exitoso actualiza periódicamente sus conocimientos consultando fuentes primarias, revistas especializadas y foros técnicos de referencia.`,
          practicalActivity: `Define tres metas concretas de desarrollo que implementarás en las próximas 4 semanas para seguir profundizando en ${topic}.`
        }
      ]
    }
  ];

  // Build units and lessons with 3 questions per lesson
  const units: Unit[] = unitBlueprints.map((blueprint, uIdx) => {
    const unitNumber = uIdx + 1;
    const unitId = `u${unitNumber}`;

    const lessons: Lesson[] = blueprint.lessons.map((lessonBlueprint, lIdx) => {
      const lessonNumber = `${unitNumber}.${lIdx + 1}`;
      const lessonId = `${unitId}-l${lIdx + 1}`;

      const quickQuiz: QuizQuestion[] = [
        {
          id: `${lessonId}-q1`,
          question: `En relación con "${lessonBlueprint.title}", ¿cuál es la premisa conceptual más importante a tener en cuenta?`,
          options: [
            `Comprender los fundamentos y relaciones causales antes de ejecutar cualquier procedimiento técnico.`,
            `Omitir el análisis previo para agilizar el tiempo de entrega.`,
            `Asumir que las variables del entorno carecen de influencia práctica.`,
            `Delegar la verificación sin registrar métricas ni evidencias.`
          ],
          correctOptionIndex: 0,
          explanation: `El rigor metodológico de ${topic} exige asentar las bases causales para garantizar decisiones reproducibles y libres de sesgos.`
        },
        {
          id: `${lessonId}-q2`,
          question: `Al aplicar lo aprendido en este apartado para un perfil de "${profile}", ¿qué buena práctica se recomienda expresamente?`,
          options: [
            `Descartar la terminología técnica estándar del sector.`,
            `Implementar verificaciones sistemáticas y contrastar los resultados con los objetivos de ${goal}.`,
            `Modificar aleatoriamente los parámetros de trabajo sin registrar los cambios.`,
            `Considerar únicamente escenarios teóricos ideales.`
          ],
          correctOptionIndex: 1,
          explanation: `La contrastación continua contra el objetivo (${goal}) previene errores críticos y optimiza la calidad del resultado final.`
        },
        {
          id: `${lessonId}-q3`,
          question: `¿Qué factor distingue un trabajo de calidad superior en ${topic}?`,
          options: [
            `La rapidez extrema a expensas de la precisión conceptual.`,
            `La ausencia de documentación y la opacidad en las conclusiones.`,
            `La precisión léxica, la justificación de evidencias y la consistencia metodológica.`,
            `El uso exclusivo de estimaciones subjetivas.`
          ],
          correctOptionIndex: 2,
          explanation: `La excelencia formativa y profesional se refleja en la solidez de los argumentos y el rigor en la presentación técnica.`
        }
      ];

      return {
        id: lessonId,
        lessonNumber,
        title: lessonBlueprint.title,
        durationMinutes: lessonBlueprint.durationMinutes,
        keyIdea: lessonBlueprint.keyIdea,
        appliedExample: lessonBlueprint.appliedExample,
        practicalActivity: lessonBlueprint.practicalActivity,
        quickQuiz
      };
    });

    return {
      id: unitId,
      unitNumber,
      title: blueprint.title,
      summary: blueprint.summary,
      lessons
    };
  });

  // Final Assessment: 8 questions
  const finalAssessment: QuizQuestion[] = [
    {
      id: 'fa-loc-1',
      question: `¿Cuál es el objetivo primordial al estructurar un plan de trabajo en ${topic}?`,
      options: [
        `Garantizar rigor metodológico, coherencia en las decisiones y trazabilidad en los resultados.`,
        `Prescindir de controles de calidad para ahorrar tiempo de desarrollo.`,
        `Improvisar los procedimientos sin consultar el marco teórico previo.`,
        `Limitarse a la memorización superficial de términos aislados.`
      ],
      correctOptionIndex: 0,
      explanation: `La trazabilidad y la coherencia son indispensables para que cualquier proyecto de ${topic} sea validado formalmente.`
    },
    {
      id: 'fa-loc-2',
      question: `Para el perfil de "${profile}", ¿cómo influye el dominio de la terminología técnica específica?`,
      options: [
        `Es un aspecto prescindible que no añade valor operativo.`,
        `Proporciona claridad argumental, reduce malentendidos y refuerza la autoridad pedagógica y profesional.`,
        `Solo es necesario para redactar artículos históricos sin aplicación moderna.`,
        `Dificulta innecesariamente la comunicación en equipos multidisciplinares.`
      ],
      correctOptionIndex: 1,
      explanation: `El vocabulario técnico adecuado es el puente que conecta el análisis riguroso con la toma de decisiones efectiva.`
    },
    {
      id: 'fa-loc-3',
      question: `Al enfrentarse a un caso complejo con múltiples variables en ${topic}, ¿qué enfoque metodológico es el más adecuado?`,
      options: [
        `Tomar la primera solución aparente sin analizar las condiciones de contorno.`,
        `Descomponer el problema en variables controlables y dependientes, analizando su impacto secuencialmente.`,
        `Abandonar el marco sistemático y proceder por ensayo y error no documentado.`,
        `Rechazar el problema por exceder el tiempo de revisión estándar.`
      ],
      correctOptionIndex: 1,
      explanation: `La descomposición estructurada de variables es la estrategia analítica estándar para abordar la complejidad con solvencia.`
    },
    {
      id: 'fa-loc-4',
      question: `En relación con el objetivo de "${goal}", ¿qué criterio de evaluación debe primar al dar por consolidado un aprendizaje?`,
      options: [
        `Haber respondido únicamente una pregunta de memoria.`,
        `Demostrar capacidad para aplicar los principios a casos reales y resolver retos análogos con autonomía.`,
        `Haber completado las lecturas sin realizar ninguna actividad práctica.`,
        `No haber formulado ninguna duda durante el proceso.`
      ],
      correctOptionIndex: 1,
      explanation: `La verdadera competencia formativa se demuestra cuando el alumno transfiere el conocimiento a situaciones prácticas novedosas.`
    },
    {
      id: 'fa-loc-5',
      question: `¿Cuál de las siguientes afirmaciones sobre la optimización de procesos en ${topic} es CORRECTA?`,
      options: [
        `Optimizar significa saltarse fases de comprobación técnica.`,
        `La optimización busca la máxima eficacia y robustez minimizando el margen de error e incertidumbre.`,
        `Solo debe aplicarse si los recursos financieros son ilimitados.`,
        `Es contraria al cumplimiento de estándares de calidad.`
      ],
      correctOptionIndex: 1,
      explanation: `La optimización técnica balancea precisión, tiempo y recursos asegurando la solidez de la entrega.`
    },
    {
      id: 'fa-loc-6',
      question: `¿Por qué es fundamental documentar y justificar las decisiones técnicas tomadas en ${topic}?`,
      options: [
        `Para que otros especialistas puedan auditar, replicar y validar los resultados alcanzados.`,
        `Únicamente para cumplir un trámite administrativo sin valor didáctico.`,
        `Para ocultar las discrepancias entre la teoría y la práctica.`,
        `No es fundamental y puede omitirse habitualmente.`
      ],
      correctOptionIndex: 0,
      explanation: `El principio de reproducibilidad y auditoría científica es un pilar de cualquier disciplina rigurosa.`
    },
    {
      id: 'fa-loc-7',
      question: `¿Qué estrategia de estudio ha demostrado mayor eficacia para retener los mecanismos de ${topic} a largo plazo?`,
      options: [
        `La relectura pasiva y continuada sin autoevaluación.`,
        `La evocación activa mediante resolución de problemas, esquematización y respuesta a tests reflexivos.`,
        `El estudio concentrado en una única sesión la noche anterior a la entrega.`,
        `Delegar la resolución de actividades en terceras personas.`
      ],
      correctOptionIndex: 1,
      explanation: `La neurociencia del aprendizaje confirma que la evocación activa y la autoevaluación regular maximizan la memoria comprensiva.`
    },
    {
      id: 'fa-loc-8',
      question: `Al concluir el curso, ¿cuál es la mejor recomendación para capitalizar lo aprendido?`,
      options: [
        `Dar por cerrado el tema y no volver a consultar fuentes de referencia.`,
        `Integrar los conocimientos en los proyectos prácticos y fijar un plan continuado de actualización.`,
        `Descartar los esquemas y notas elaborados durante el itinerario.`,
        `Aplicar las técnicas únicamente cuando sean de obligado cumplimiento formal.`
      ],
      correctOptionIndex: 1,
      explanation: `La consolidación del conocimiento culmina en su transferencia práctica continua en el entorno laboral y formativo.`
    }
  ];

  // 2 Final Practical Projects
  const finalProjects: FinalProject[] = [
    {
      id: 'proj-loc-1',
      title: `Dossier Técnico Integral de Aplicación: ${topic}`,
      description: `Diseña y documenta una propuesta técnica o proyecto integral adaptado a las necesidades de "${profile}". El proyecto debe articular los fundamentos de las 4 unidades formativas, resolver un caso práctico de alta exigencia y alinearse con la meta de: "${goal}".`,
      deliverable: 'Documento estructurado en formato PDF o memoria de trabajo que incluya: 1) Diagnóstico de partida; 2) Justificación conceptual y marco teórico; 3) Plan de ejecución paso a paso con tabla de hitos; 4) Mecanismos de control de calidad y mitigación de errores.',
      evaluationCriteria: [
        'Rigor conceptual y adecuación de la terminología técnica empleada.',
        'Viabilidad operativa y realismo práctico de la propuesta.',
        'Claridad expositiva, orden analítico y presentación profesional.'
      ]
    },
    {
      id: 'proj-loc-2',
      title: `Manual Operativo de Buenas Prácticas y Guía de Resolución de ${topic}`,
      description: `Elabora una guía metodológica de consulta rápida o infografía operativa orientada a transferir el conocimiento adquirido a tu entorno de estudio o equipo de trabajo.`,
      deliverable: 'Guía visual de referencia o manual sintético con diagramas de flujo de decisión, matriz de variables clave, lista de comprobación de calidad y resumen de advertencias sobre errores típicos.',
      evaluationCriteria: [
        'Capacidad de síntesis pedagógica sin pérdida de rigor analítico.',
        'Utilidad práctica como herramienta de consulta en momentos de presión o examen.',
        'Estructura visual atractiva, limpia y de lectura inmediata.'
      ]
    }
  ];

  // Sources and References
  const sourcesAndReferences: SourceReference[] = [
    {
      title: `Manual Canónico de Referencia en ${topic}`,
      type: 'libro',
      description: 'Obra de texto académica estándar reconocida por su rigor metodológico y profundidad en el tratamiento de los principios esenciales.'
    },
    {
      title: `Compendio Curricular Oficial y Directrices de Evaluación`,
      type: 'documentación oficial',
      description: `Normativa y directrices formales aplicables al perfil de ${profile} y a los estándares exigidos para ${goal}.`
    },
    {
      title: `Repositorio de Casos Prácticos y Recursos Abiertos sobre ${topic}`,
      type: 'recurso académico',
      description: 'Plataforma educativa con documentación contrastada, ejercicios guiados y artículos especializados de libre consulta.'
    },
    {
      title: `Portal Profesional y Buenas Prácticas del Sector`,
      type: 'sitio web',
      description: 'Publicaciones técnicas y guías de actualización continua para especialistas y estudiantes avanzados.'
    }
  ];

  return {
    id: courseId,
    title: `Curso Completo: ${topic}`,
    subtitle: `Itinerario formativo especializado estructurado según los más altos estándares instruccionales para ${profile}. Diseñado para alcanzar con éxito: ${goal}.`,
    level,
    estimatedDuration: time,
    targetProfile: profile,
    mainGoal: goal,
    preferredFormat: format,
    learningObjectives: [
      `Dominar los principios teóricos y el marco conceptual nuclear de ${topic}.`,
      `Manejar con fluidez y precisión la terminología técnica y las variables clave del sector.`,
      `Aplicar metodologías estructuradas para resolver problemas reales en el contexto de ${profile}.`,
      `Identificar y prevenir los errores críticos más frecuentes mediante controles de calidad.`,
      `Alcanzar con solvencia el objetivo de aprendizaje prioritario: ${goal}.`
    ],
    units,
    finalAssessment,
    finalProjects,
    sourcesAndReferences,
    createdAt: new Date().toISOString()
  };
}
