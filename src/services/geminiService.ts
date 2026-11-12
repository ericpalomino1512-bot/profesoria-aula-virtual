import type { Course, CourseFormData } from '../types/course';
import { COURSE_BUILDER_PROMPT, buildUserPrompt } from './coursePrompt';
import { DEMO_COURSE } from './demoCourse';

const STORAGE_API_KEY = 'profesoria_gemini_api_key';

export function getStoredApiKey(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(STORAGE_API_KEY) || (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
}

export function setStoredApiKey(key: string): void {
  if (typeof window !== 'undefined') {
    if (key.trim()) {
      localStorage.setItem(STORAGE_API_KEY, key.trim());
    } else {
      localStorage.removeItem(STORAGE_API_KEY);
    }
  }
}

/**
 * Extracts and cleans JSON from a model's response string.
 */
function cleanAndParseJSON(rawText: string): any {
  let cleaned = rawText.trim();

  // If wrapped in markdown code fences
  const markdownMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
  if (markdownMatch && markdownMatch[1]) {
    cleaned = markdownMatch[1].trim();
  } else {
    // If there is extraneous text before the first '{' or after the last '}'
    const firstBrace = cleaned.indexOf('{');
    const lastBrace = cleaned.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      cleaned = cleaned.substring(firstBrace, lastBrace + 1);
    }
  }

  try {
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('Error parsing JSON from Gemini response. Raw response was:\n', rawText);
    throw new Error('No se pudo interpretar la respuesta estructurada de la IA. Por favor, reintenta.');
  }
}

/**
 * Sanitizes and fills any missing attributes in the generated course to ensure UI stability.
 */
function normalizeCourse(raw: any, formData: CourseFormData): Course {
  const courseId = `curso-${Date.now()}`;

  const units = Array.isArray(raw.units) ? raw.units.map((u: any, uIdx: number) => {
    const unitNumber = u.unitNumber || uIdx + 1;
    const unitId = u.id || `u${unitNumber}`;

    const lessons = Array.isArray(u.lessons) ? u.lessons.map((l: any, lIdx: number) => {
      const lessonNumber = l.lessonNumber || `${unitNumber}.${lIdx + 1}`;
      const lessonId = l.id || `${unitId}-l${lIdx + 1}`;

      const quickQuiz = Array.isArray(l.quickQuiz) ? l.quickQuiz.map((q: any, qIdx: number) => ({
        id: q.id || `${lessonId}-q${qIdx + 1}`,
        question: q.question || 'Pregunta de autoevaluación',
        options: Array.isArray(q.options) && q.options.length >= 4 
          ? [q.options[0], q.options[1], q.options[2], q.options[3]] as [string, string, string, string]
          : ['Opción A', 'Opción B', 'Opción C', 'Opción D'] as [string, string, string, string],
        correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
        explanation: q.explanation || 'Respuesta justificada pedagógicamente.'
      })) : [];

      return {
        id: lessonId,
        lessonNumber,
        title: l.title || `Lección ${lessonNumber}`,
        durationMinutes: l.durationMinutes || 20,
        keyIdea: l.keyIdea || 'Concepto fundamental del temario.',
        appliedExample: l.appliedExample || 'Ejemplo representativo del mundo profesional o académico.',
        practicalActivity: l.practicalActivity || 'Pon en práctica este concepto en tu cuaderno o entorno de trabajo.',
        quickQuiz
      };
    }) : [];

    return {
      id: unitId,
      unitNumber,
      title: u.title || `Unidad ${unitNumber}`,
      summary: u.summary || 'Resumen de los contenidos clave de la unidad.',
      lessons
    };
  }) : [];

  const finalAssessment = Array.isArray(raw.finalAssessment) ? raw.finalAssessment.map((q: any, idx: number) => ({
    id: q.id || `fa-${idx + 1}`,
    question: q.question || 'Pregunta de la evaluación final',
    options: Array.isArray(q.options) && q.options.length >= 4 
      ? [q.options[0], q.options[1], q.options[2], q.options[3]] as [string, string, string, string]
      : ['Opción A', 'Opción B', 'Opción C', 'Opción D'] as [string, string, string, string],
    correctOptionIndex: typeof q.correctOptionIndex === 'number' ? q.correctOptionIndex : 0,
    explanation: q.explanation || 'Justificación académica completa.'
  })) : [];

  const finalProjects = Array.isArray(raw.finalProjects) ? raw.finalProjects.map((p: any, idx: number) => ({
    id: p.id || `proj-${idx + 1}`,
    title: p.title || `Proyecto Integrador ${idx + 1}`,
    description: p.description || 'Desarrollo práctico aplicado de los conocimientos del curso.',
    deliverable: p.deliverable || 'Informe técnico o proyecto práctico.',
    evaluationCriteria: Array.isArray(p.evaluationCriteria) ? p.evaluationCriteria : ['Rigor conceptual', 'Aplicación práctica', 'Presentación']
  })) : [];

  const sourcesAndReferences = Array.isArray(raw.sourcesAndReferences) ? raw.sourcesAndReferences.map((s: any) => ({
    title: s.title || 'Fuente de consulta recomendada',
    type: s.type || 'sitio web',
    description: s.description || 'Recurso didáctico de referencia contrastada.',
    url: s.url || undefined
  })) : [];

  return {
    id: courseId,
    title: raw.title || `Curso Completo: ${formData.topic}`,
    subtitle: raw.subtitle || `Itinerario formativo especializado diseñado para el perfil ${formData.studentProfile}.`,
    level: formData.level,
    estimatedDuration: raw.estimatedDuration || formData.availableTime,
    targetProfile: formData.studentProfile,
    mainGoal: formData.mainGoal,
    preferredFormat: formData.preferredFormat,
    learningObjectives: Array.isArray(raw.learningObjectives) && raw.learningObjectives.length > 0 
      ? raw.learningObjectives 
      : [
          `Comprender los fundamentos teóricos de ${formData.topic}.`,
          `Aplicar conceptos clave en casos reales acordes al nivel ${formData.level}.`,
          `Alcanzar con soltura el objetivo de: ${formData.mainGoal}.`
        ],
    units: units.length > 0 ? units : DEMO_COURSE.units,
    finalAssessment: finalAssessment.length > 0 ? finalAssessment : DEMO_COURSE.finalAssessment,
    finalProjects: finalProjects.length > 0 ? finalProjects : DEMO_COURSE.finalProjects,
    sourcesAndReferences: sourcesAndReferences.length > 0 ? sourcesAndReferences : DEMO_COURSE.sourcesAndReferences,
    createdAt: new Date().toISOString()
  };
}

export async function generateCourseWithGemini(
  formData: CourseFormData,
  onProgress?: (status: string) => void,
  documentContext?: string
): Promise<Course> {
  const apiKey = formData.apiKey || getStoredApiKey();

  // If no API key is provided, return rich interactive demo course adapted to user inputs
  if (!apiKey) {
    onProgress?.('Cargando aula virtual de muestra interactiva...');
    await new Promise((r) => setTimeout(r, 900));
    return {
      ...DEMO_COURSE,
      id: `curso-${Date.now()}`,
      targetProfile: formData.studentProfile || DEMO_COURSE.targetProfile,
      mainGoal: formData.mainGoal || DEMO_COURSE.mainGoal,
      level: formData.level || DEMO_COURSE.level,
      preferredFormat: formData.preferredFormat || DEMO_COURSE.preferredFormat
    };
  }

  onProgress?.('Conectando con Google Gemini...');

  let docSectionPrompt = '';
  if (documentContext && documentContext.trim()) {
    docSectionPrompt = `\n\nMATERIAL DIDÁCTICO APORTADO POR EL USUARIO (PPT/PDF/DOCS):\n"""\n${documentContext.substring(0, 35000)}\n"""\nINSTRUCCIÓN CRÍTICA: Basa estrictamente las unidades, lecciones, ejemplos y preguntas en el material aportado arriba.`;
  }

  const systemAndUserPrompt = `${COURSE_BUILDER_PROMPT}\n\n${buildUserPrompt(formData)}${docSectionPrompt}`;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

  onProgress?.('Elaborando itinerario instruccional, unidades, lecciones y evaluaciones...');

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: systemAndUserPrompt
          }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.35,
      responseMimeType: 'application/json'
    }
  };

  try {
    let response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      console.warn('Primary attempt failed, retrying fallback without mimeType...');
      onProgress?.('Sintetizando lecciones y cuestionarios interactivos...');
      const fallbackBody = {
        contents: [
          {
            parts: [
              {
                text: `${systemAndUserPrompt}\nIMPORTANTE: Devuelve únicamente código JSON válido sin comentarios ni formato extra.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.35
        }
      };

      response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fallbackBody)
      });

      if (!response.ok) {
        const fallbackError = await response.json().catch(() => ({}));
        throw new Error(
          fallbackError.error?.message || 
          `Error en la API de Gemini (${response.status}): ${response.statusText}`
        );
      }
    }

    onProgress?.('Estructurando aula virtual y tarjetas de estudio...');
    const result = await response.json();
    const candidate = result.candidates?.[0];
    const text = candidate?.content?.parts?.[0]?.text;

    if (!text) {
      throw new Error('Gemini no devolvió texto en la respuesta.');
    }

    const parsedJson = cleanAndParseJSON(text);
    return normalizeCourse(parsedJson, formData);

  } catch (err: any) {
    console.error('Error al generar curso:', err);
    throw new Error(err.message || 'Ocurrió un error inesperado al conectar con el modelo Gemini.');
  }
}
