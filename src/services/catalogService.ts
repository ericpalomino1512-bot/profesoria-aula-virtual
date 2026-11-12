import type { Course } from '../types/course';
import { DEMO_COURSE } from './demoCourse';

export const INITIAL_CATALOG_COURSES: Course[] = [
  {
    ...DEMO_COURSE,
    id: 'quimica-organica-ebau',
    price: 29,
    currency: 'USD',
    category: 'Ciencias y Bachillerato',
    isPublished: true,
  },
  {
    id: 'captacion-exclusivas-ia',
    title: 'Captación de Propiedades en Exclusiva con Inteligencia Artificial',
    subtitle: 'Metodología probada para agentes inmobiliarios: prospección automatizada, valoración de inmuebles y guiones persuasivos.',
    level: 'Intermedio',
    estimatedDuration: '4 semanas (30 min/día • 14 h totales)',
    targetProfile: 'Agentes y asesores inmobiliarios independientes o de agencia',
    mainGoal: 'Conseguir entre 3 y 5 mandatos en exclusiva al mes con apoyo de IA',
    preferredFormat: 'Lecturas + ejercicios',
    price: 49,
    currency: 'USD',
    category: 'Inmobiliario y Ventas',
    isPublished: true,
    learningObjectives: [
      'Dominar la prospección de propietarios particulares usando prompts avanzados de IA.',
      'Diseñar análisis comparativos de mercado (ACM) visuales e irresistibles en minutos.',
      'Rebatir objeciones clásicas ("no quiero exclusivas", "cobras mucha comisión") con argumentos sólidos.',
      'Crear campañas de marketing hipersegmentadas para vender los inmuebles captados.',
      'Automatizar el seguimiento por WhatsApp y email sin perder el trato humano.'
    ],
    units: [
      {
        id: 'u1-prospeccion',
        unitNumber: 1,
        title: 'Módulo 1: Prospección Inteligente y Filtrado de Propietarios',
        summary: 'Aprende a identificar qué propietarios tienen urgencia real de venta y cómo contactarlos sin ser invasivo.',
        lessons: [
          {
            id: 'l1-1-mentalidad',
            lessonNumber: '1.1',
            title: 'La propuesta de valor del agente moderno frente al propietario particular',
            durationMinutes: 15,
            keyIdea: 'El propietario que vende por su cuenta no busca ahorrar dinero por capricho; busca evitar malas experiencias. Tu rol no es cobrar un porcentaje, sino blindar su patrimonio legal y fiscalmente, garantizando el precio máximo de mercado.',
            appliedExample: 'Un propietario publica un piso en un portal por 220.000€ y recibe 30 llamadas de curiosos e inmobiliarias agresivas. Al aplicar el guion de ayuda diagnóstica, el propietario acepta una reunión contigo porque percibe que eres un asesor consultivo y no un comisionista.',
            practicalActivity: 'Redacta un mensaje de contacto inicial de 4 líneas enfocado 100% en el beneficio del propietario (sin mencionar la palabra "exclusiva" en el primer contacto).',
            quickQuiz: [
              {
                id: 'q1-1',
                question: '¿Cuál es el principal motivo por el que un particular decide vender directamente sin agencia?',
                options: [
                  'Porque le sobra tiempo y disfruta negociar con compradores',
                  'Por desconfianza previa o creencia de que las agencias solo ponen un anuncio y cobran',
                  'Porque la ley no permite el uso de inmobiliarias en ciertas zonas',
                  'Porque prefiere pagar más impuestos'
                ],
                correctOptionIndex: 1,
                explanation: 'La resistencia del propietario suele nacer de la desconfianza hacia el servicio tradicional; revertir esa percepción con rigor profesional es la clave de la exclusiva.'
              },
              {
                id: 'q1-2',
                question: '¿Qué elemento genera mayor credibilidad en el primer contacto con un propietario?',
                options: [
                  'Presumir de cuántas casas has vendido en tu vida',
                  'Aportar datos reales y verificables sobre la demanda de compradores calificados en su misma calle',
                  'Ofrecerle bajar tu comisión al 1% de inmediato',
                  'Prometerle que venderás su casa en 48 horas sin haberla visitado'
                ],
                correctOptionIndex: 1,
                explanation: 'Los datos concretos de demanda real en su zona generan autoridad instantánea y despiertan el interés genuino del propietario.'
              },
              {
                id: 'q1-3',
                question: '¿En qué momento debe solicitarse la firma del contrato de exclusiva?',
                options: [
                  'En el primer segundo de la primera llamada telefónica',
                  'Únicamente tras haber realizado el Análisis Comparativo y haber acordado una estrategia de precio y marketing conjunta',
                  'Al final de la operación, cuando ya se firma ante notario',
                  'Nunca; los contratos formales asustan al cliente'
                ],
                correctOptionIndex: 1,
                explanation: 'La exclusiva es el resultado natural de haber presentado un plan de comercialización impecable y un precio realista acordado con el cliente.'
              }
            ],
            video: {
              title: 'La Propuesta de Valor Irresistible en Exclusiva',
              durationFormatted: '4:20',
              slides: [
                {
                  id: 's1',
                  badge: 'Fundamentos',
                  title: 'Por qué la Exclusiva Beneficia al Propietario',
                  subtitle: 'Cómo cambiar la narrativa del servicio inmobiliario',
                  bullets: [
                    'Mayor inversión publicitaria dedicada al inmueble.',
                    'Filtro de compradores cualificados con solvencia bancaria previa.',
                    'Defensa del precio de venta sin guerras entre inmobiliarias.'
                  ],
                  narrationText: 'Bienvenidos a esta lección. Vamos a transformar la manera en que te presentas ante un propietario. La exclusiva no es para tu tranquilidad, es la única herramienta que garantiza al propietario vender al precio máximo y con total seguridad legal.',
                  durationSeconds: 20
                },
                {
                  id: 's2',
                  badge: 'Metodología',
                  title: 'El Guion Consultivo de 3 Pasos',
                  subtitle: 'Estructura de la primera llamada',
                  bullets: [
                    'Paso 1: Validación y empatía con su situación de venta.',
                    'Paso 2: Diagnóstico del mercado actual en su código postal.',
                    'Paso 3: Cita de valoración presencial sin compromiso.'
                  ],
                  narrationText: 'Observa la estructura de tres pasos: validación, diagnóstico de mercado y propuesta de cita. En ningún momento forzamos la venta; creamos el contexto para que el propietario pida nuestra opinión técnica.',
                  durationSeconds: 25
                }
              ]
            }
          },
          {
            id: 'l1-2-acm-ia',
            lessonNumber: '1.2',
            title: 'Creación de Análisis Comparativos de Mercado (ACM) con IA',
            durationMinutes: 20,
            keyIdea: 'El precio no lo fija el propietario por sus sueños ni el agente por intuición; lo determina la oferta activa y las transacciones cerradas recientemente. La IA permite sintetizar 10 inmuebles comparables en un informe visual que demuestra la franja óptima de salida.',
            appliedExample: 'Un piso similar en la misma manzana tardó 8 meses en venderse por salir 30.000€ sobrevalorado. Mostrando la gráfica de absorción generada en tu informe, el propietario comprende el riesgo de "quemar" el inmueble.',
            practicalActivity: 'Elabora un cuadro con 3 inmuebles testigos comparando m², estado de conservación y precio/m² para justificar un valor de tasación.',
            quickQuiz: [
              {
                id: 'q2-1',
                question: '¿Qué riesgo asume el propietario al salir al mercado con un precio fuera de rango?',
                options: [
                  'Que el inmueble se venda demasiado rápido',
                  'Que el inmueble se "queme" tras semanas sin visitas y termine vendiéndose por debajo de su valor real',
                  'Que el banco le cobre una multa fiscal',
                  'No existe ningún riesgo, siempre se puede bajar después sin consecuencias'
                ],
                correctOptionIndex: 1,
                explanation: 'El mayor pico de interés de un inmueble ocurre en las primeras dos semanas. Si sale fuera de precio, se vuelve invisible para compradores calificados.'
              },
              {
                id: 'q2-2',
                question: '¿Cuáles son los dos tipos de comparables esenciales en un ACM profesional?',
                options: [
                  'Inmuebles en alquiler e inmuebles comerciales',
                  'Inmuebles actualmente en venta (competencia) e inmuebles realmente vendidos en la zona (realidad notarial)',
                  'Solo casas de lujo y áticos',
                  'Inmuebles de otras ciudades similares'
                ],
                correctOptionIndex: 1,
                explanation: 'Comparar lo que compite hoy y lo que realmente se ha cerrado en notaría da la imagen exacta del precio de mercado.'
              },
              {
                id: 'q2-3',
                question: '¿Cómo ayuda la IA en la elaboración del informe de valoración?',
                options: [
                  'Inventa datos sin verificar',
                  'Calcula coeficientes de ajuste, redacta la justificación cualitativa y detecta factores diferenciales',
                  'Firma el documento legal ante notario',
                  'Compra el inmueble automáticamente'
                ],
                correctOptionIndex: 1,
                explanation: 'La IA agiliza el cálculo analítico y genera explicaciones claras y pedagógicas para que el cliente entienda las razones del precio sugerido.'
              }
            ]
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: 'fa-1',
        question: '¿Cuál es el factor clave para retener un mandato en exclusiva durante todo el periodo acordado?',
        options: [
          'No llamar al propietario para no molestarlo',
          'Enviar informes quincenales transparentes de métricas, visitas y feedback de compradores',
          'Bajar el precio cada semana sin avisar',
          'Quitar el cartel de venta de la fachada'
        ],
        correctOptionIndex: 1,
        explanation: 'La comunicación y transparencia constante mantiene la confianza absoluta del cliente.'
      }
    ],
    finalProjects: [
      {
        id: 'fp-1',
        title: 'Dossier Integral de Captación para un Propietario Real',
        description: 'Elabora un dossier de 5 páginas incluyendo: perfil del comprador potencial, análisis comparativo de 4 testigos, plan de marketing a 30 días y guion de resolución de la objeción de honorarios.',
        deliverable: 'Documento PDF estructurado listo para presentar en reunión presencial.',
        evaluationCriteria: [
          'Rigor de los datos del ACM',
          'Claridad y profesionalismo visual de la propuesta',
          'Argumentación fundamentada de la comisión'
        ]
      }
    ],
    sourcesAndReferences: [
      {
        title: 'Colegio Oficial de Agentes de la Propiedad Inmobiliaria (API)',
        type: 'documentación oficial',
        description: 'Guías de deontología y buenas prácticas en mediación inmobiliaria.',
        url: 'https://www.consejocoapis.org'
      },
      {
        title: 'Estadística Registral Inmobiliaria - Colegio de Registradores',
        type: 'recurso académico',
        description: 'Informes trimestrales oficiales sobre transacciones y precios de compraventa.',
        url: 'https://www.registradores.org'
      }
    ],
    createdAt: new Date().toISOString()
  },
  {
    id: 'marketing-inmobiliario-redes',
    title: 'Marketing Inmobiliario Digital: De Cero a Leads Cualificados',
    subtitle: 'Domina Instagram Reels, tours virtuales, Google Ads y funnels para vender propiedades y atraer compradores solventes.',
    level: 'Principiante',
    estimatedDuration: '2 semanas (30 min/día • 7 h totales)',
    targetProfile: 'Agentes inmobiliarios que quieren dejar de depender solo de los portales',
    mainGoal: 'Generar consultas diarias de compradores e inversores cualificados',
    preferredFormat: 'Lecturas + ejercicios',
    price: 39,
    currency: 'USD',
    category: 'Marketing y Redes',
    isPublished: true,
    learningObjectives: [
      'Crear videos de casas (Home Tours) dinámicos que retengan la atención en redes sociales.',
      'Configurar campañas de anuncios hiperlocales segmentadas por código postal y nivel de ingresos.',
      'Diseñar landing pages de captura que conviertan visitas en contactos de WhatsApp.',
      'Implementar email marketing automatizado para nutrir a tu base de inversores.'
    ],
    units: [
      {
        id: 'u-mkt-1',
        unitNumber: 1,
        title: 'Módulo 1: Creación de Contenido Inmobiliario de Alto Impacto',
        summary: 'Técnicas de video con smartphone y copywriting para mostrar propiedades de forma magnética.',
        lessons: [
          {
            id: 'l-mkt-1',
            lessonNumber: '1.1',
            title: 'Estructura de un Reel inmobiliario viral que sí genera consultas',
            durationMinutes: 15,
            keyIdea: 'Un tour inmobiliario en redes no es un catálogo de habitaciones; es una experiencia aspiracional. Los primeros 3 segundos (el gancho) determinan el 90% del éxito.',
            appliedExample: 'En vez de empezar diciendo "Hola, hoy les muestro este piso en Madrid", empiezas con: "¿Vivirías en un ático con terraza de 40m² por el precio de un bajo interior?". Las visitas aumentan un 400%.',
            practicalActivity: 'Graba con tu teléfono un video de 30 segundos de una estancia aplicando la técnica del gancho + solución.',
            quickQuiz: [
              {
                id: 'qmkt-1',
                question: '¿Qué elemento es el más crítico en los primeros 3 segundos de un video inmobiliario?',
                options: [
                  'Decir el nombre completo de tu agencia inmobiliaria',
                  'Un gancho visual o pregunta intrigante sobre el estilo de vida que ofrece la vivienda',
                  'Mostrar la cédula de habitabilidad',
                  'Poner música clásica a bajo volumen'
                ],
                correctOptionIndex: 1,
                explanation: 'El usuario hace scroll rápidamente; captar su curiosidad en 3 segundos es vital.'
              },
              {
                id: 'qmkt-2',
                question: '¿Por qué conviene publicar el precio en la publicación o al final del video?',
                options: [
                  'Porque es obligatorio por la ley de telecomunicaciones',
                  'Para filtrar curiosos y recibir únicamente contactos con interés y capacidad económica real',
                  'Para que la competencia nos copie',
                  'No se debe poner nunca el precio'
                ],
                correctOptionIndex: 1,
                explanation: 'Ocultar el precio satura la bandeja de entrada con personas que no tienen presupuesto para el inmueble.'
              },
              {
                id: 'qmkt-3',
                question: '¿Qué llamada a la acción (CTA) genera mayor conversión en Instagram?',
                options: [
                  'Decir "llamadme por teléfono al fijo"',
                  'Invitar a comentar una palabra clave (ej: "INFO") para recibir el enlace con fotos por mensaje privado automatizado',
                  'Decir "compra ya"',
                  'No poner ninguna llamada a la acción'
                ],
                correctOptionIndex: 1,
                explanation: 'Comentar una palabra activa el algoritmo y automatiza el envío del dossier directo al chat del cliente.'
              }
            ]
          }
        ]
      }
    ],
    finalAssessment: [
      {
        id: 'fa-mkt-1',
        question: '¿Cuál es la métrica clave para evaluar si una campaña inmobiliaria está funcionando?',
        options: [
          'La cantidad de "Me gusta" de amigos y familiares',
          'El coste por lead cualificado (propietario o comprador con solvencia) que agenda una visita o tasación',
          'El número de seguidores de la cuenta',
          'La cantidad de historias publicadas al día'
        ],
        correctOptionIndex: 1,
        explanation: 'En el sector inmobiliario lo que importa son los leads con intención y capacidad de compraventa, no las métricas de vanidad.'
      }
    ],
    finalProjects: [
      {
        id: 'fp-mkt-1',
        title: 'Campaña Digital Completa de Lanzamiento de un Inmueble',
        description: 'Planifica la sesión fotográfica, el guion del video, el texto descriptivo persuasivo y el anuncio en Meta Ads para un inmueble seleccionado.',
        deliverable: 'Plan de campaña en PDF con copys, creatividades y segmentación.',
        evaluationCriteria: ['Calidad del copy publicitario', 'Estrategia de segmentación', 'Coherencia de la llamada a la acción']
      }
    ],
    sourcesAndReferences: [
      {
        title: 'Meta Blueprint - Estrategias de Generación de Clientes Potenciales',
        type: 'documentación oficial',
        description: 'Guía oficial de Facebook e Instagram para campañas de conversión.',
        url: 'https://www.facebook.com/business/learn'
      }
    ],
    createdAt: new Date().toISOString()
  }
];

export const getStoredCatalog = (): Course[] => {
  if (typeof window === 'undefined') return INITIAL_CATALOG_COURSES;
  const stored = localStorage.getItem('profesoria_catalog_courses');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {}
  }
  localStorage.setItem('profesoria_catalog_courses', JSON.stringify(INITIAL_CATALOG_COURSES));
  return INITIAL_CATALOG_COURSES;
};

export const saveCatalogCourse = (course: Course): void => {
  const current = getStoredCatalog();
  const index = current.findIndex(c => c.id === course.id);
  let updated: Course[];
  if (index >= 0) {
    updated = [...current];
    updated[index] = { ...updated[index], ...course };
  } else {
    updated = [course, ...current];
  }
  localStorage.setItem('profesoria_catalog_courses', JSON.stringify(updated));
};

export const getEnrolledCourseIds = (): string[] => {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem('student_enrolled_courses');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {}
  }
  // By default, demo course is enrolled for testing
  const initial = ['quimica-organica-ebau'];
  localStorage.setItem('student_enrolled_courses', JSON.stringify(initial));
  return initial;
};

export const enrollInCourse = (courseId: string): void => {
  const current = getEnrolledCourseIds();
  if (!current.includes(courseId)) {
    const updated = [...current, courseId];
    localStorage.setItem('student_enrolled_courses', JSON.stringify(updated));
  }
};
