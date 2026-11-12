import * as XLSX from 'xlsx';
import type { Lesson, LessonVideoData, LessonAttachment, VideoSlide } from '../types/course';

/**
 * Builds synchronized video slides with narration scripts for a lesson.
 */
export function buildLessonVideoData(lesson: Lesson, unitTitle: string): LessonVideoData {
  const slides: VideoSlide[] = [
    {
      id: `${lesson.id}-slide-1`,
      title: `Bienvenida a la Lección ${lesson.lessonNumber}`,
      subtitle: lesson.title,
      badge: 'Capítulo 1: Introducción',
      bullets: [
        `Ruta: ${unitTitle}`,
        `Duración estimada: ${lesson.durationMinutes} minutos de estudio activo`,
        'Objetivo: Comprender los conceptos esenciales y su aplicación práctica'
      ],
      narrationText: `¡Hola y bienvenidos a la lección ${lesson.lessonNumber}! En esta sesión abordaremos ${lesson.title}. Nuestro propósito es desgranar los fundamentos teóricos y ver exactamente cómo se aplican en situaciones reales. Prepárate para tomar notas y poner a prueba lo aprendido.`,
      durationSeconds: 14
    },
    {
      id: `${lesson.id}-slide-2`,
      title: 'Idea Clave y Marco Teórico',
      subtitle: 'El concepto nuclear que debes dominar',
      badge: 'Capítulo 2: Fundamento Conceptual',
      bullets: lesson.keyIdea
        .split(/(?<=[.?!])\s+/)
        .filter(s => s.trim().length > 15)
        .slice(0, 3),
      narrationText: `Profundicemos en la idea clave: ${lesson.keyIdea.substring(0, 300)}. Comprender este principio te permitirá resolver problemas con criterio y anticipar cualquier dificultad en exámenes o proyectos reales.`,
      durationSeconds: 20
    },
    {
      id: `${lesson.id}-slide-3`,
      title: 'Ejemplo Aplicado en el Mundo Real',
      subtitle: 'Cómo se manifiesta este concepto en la práctica',
      badge: 'Capítulo 3: Caso Práctico',
      bullets: lesson.appliedExample
        .split(/(?<=[.?!])\s+/)
        .filter(s => s.trim().length > 15)
        .slice(0, 3),
      narrationText: `Veamos cómo se traduce esto en la realidad: ${lesson.appliedExample.substring(0, 300)}. Como puedes observar, este conocimiento tiene una repercusión directa e inmediata en el entorno operativo.`,
      durationSeconds: 20
    },
    {
      id: `${lesson.id}-slide-4`,
      title: 'Reto Práctico y Comprobación',
      subtitle: 'Tu turno para actuar',
      badge: 'Capítulo 4: Actividad y Test',
      bullets: [
        'Consigna: ' + (lesson.practicalActivity.length > 90 ? lesson.practicalActivity.substring(0, 90) + '...' : lesson.practicalActivity),
        'Completa el test rápido de 3 preguntas al pie de la lección',
        'Descarga la plantilla Excel y el Ebook para profundizar'
      ],
      narrationText: `Llegamos al momento de ponerte a prueba. Realiza la actividad propuesta y responde a las tres preguntas del test rápido para validar tu progreso. ¡Mucho ánimo y a por ello!`,
      durationSeconds: 16
    }
  ];

  return {
    title: `Video Instructivo: ${lesson.lessonNumber} ${lesson.title}`,
    durationFormatted: '1:10 min',
    slides
  };
}

/**
 * Generates and downloads a real Excel workbook (.xlsx) customized for the lesson's topic and activity.
 */
export function downloadLessonExcelWorkbook(lesson: Lesson, courseTitle: string) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: Guía y Metadatos
  const metaData = [
    ['CURSO:', courseTitle],
    ['LECCIÓN:', `${lesson.lessonNumber} - ${lesson.title}`],
    ['TIEMPO ESTIMADO:', `${lesson.durationMinutes} minutos`],
    ['FECHA DE DESCARGA:', new Date().toLocaleDateString('es-ES')],
    [],
    ['OBJETIVO DE LA ACTIVIDAD:'],
    [lesson.practicalActivity],
    [],
    ['INSTRUCCIONES:'],
    ['1. Revisa la pestaña "Datos_y_Ejercicios" para completar la plantilla.'],
    ['2. Introduce tus respuestas o fórmulas en las celdas sombreadas en verde.'],
    ['3. Consulta la pestaña "Rubrica_Evaluacion" para verificar tus criterios de éxito.']
  ];
  const wsMeta = XLSX.utils.aoa_to_sheet(metaData);
  XLSX.utils.book_append_sheet(wb, wsMeta, 'Instrucciones');

  // Sheet 2: Datos y Ejercicios
  const exerciseData = [
    ['ID', 'Aspecto Analizado', 'Parámetro / Métrica', 'Valor Inicial', 'Respuesta / Propuesta del Alumno', 'Estado'],
    ['1', 'Fundamento Teórico', 'Identificación del concepto clave', 'Definición estándar', '', 'Pendiente'],
    ['2', 'Caso Aplicado', 'Escenario de aplicación real', 'Caso de estudio 1', '', 'Pendiente'],
    ['3', 'Cálculo / Procedimiento', 'Resolución metodológica', 'Paso 1', '', 'Pendiente'],
    ['4', 'Verificación de Calidad', 'Comprobación de restricciones', 'Control 100%', '', 'Pendiente'],
    ['5', 'Conclusión Técnica', 'Impacto en el objetivo del curso', 'Resultado final', '', 'Pendiente']
  ];
  const wsExercise = XLSX.utils.aoa_to_sheet(exerciseData);
  XLSX.utils.book_append_sheet(wb, wsExercise, 'Datos_y_Ejercicios');

  // Sheet 3: Rúbrica
  const rubricData = [
    ['Criterio de Evaluación', 'Ponderación', 'Nivel Excelente (9-10)', 'Nivel Adecuado (5-8)', 'Nivel Insuficiente (0-4)'],
    ['Rigor Conceptual', '35%', 'Aplica con precisión el marco teórico', 'Comprensión general con pequeños desvíos', 'Errores graves de base'],
    ['Resolución Práctica', '40%', 'Resuelve la actividad de forma completa y óptima', 'Resuelve la mayor parte de puntos', 'Incompleto o no justificado'],
    ['Documentación y Claridad', '25%', 'Tabla estructurada con conclusiones claras', 'Formato legible y orden básico', 'Desordenado y confuso']
  ];
  const wsRubric = XLSX.utils.aoa_to_sheet(rubricData);
  XLSX.utils.book_append_sheet(wb, wsRubric, 'Rubrica_Evaluacion');

  // Generate file and trigger download
  const cleanFileName = `Plantilla_Practica_${lesson.lessonNumber.replace(/\./g, '_')}_${lesson.title.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30)}.xlsx`;
  XLSX.writeFile(wb, cleanFileName);
}

/**
 * Opens a formatted, printable eBook / Study Guide window in HTML ready to Save as PDF.
 */
export function openLessonEbookPrintView(lesson: Lesson, courseTitle: string, unitTitle: string) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const html = `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Ebook - ${lesson.lessonNumber} ${lesson.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1e293b;
      max-width: 800px;
      margin: 40px auto;
      padding: 0 20px;
    }
    .header {
      border-bottom: 2px solid #7c3aed;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .badge {
      display: inline-block;
      background: #f3e8ff;
      color: #7c3aed;
      font-size: 12px;
      font-weight: 700;
      padding: 4px 12px;
      border-radius: 9999px;
      text-transform: uppercase;
    }
    h1 {
      color: #0f172a;
      font-size: 28px;
      margin: 12px 0 6px 0;
    }
    .meta {
      color: #64748b;
      font-size: 14px;
    }
    .section {
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 24px;
      margin-bottom: 24px;
      page-break-inside: avoid;
    }
    .section-title {
      font-size: 18px;
      font-weight: 700;
      color: #4338ca;
      margin-top: 0;
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .quiz-card {
      background: white;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      padding: 16px;
      margin-top: 12px;
    }
    .options {
      margin-top: 8px;
      padding-left: 20px;
    }
    .footer {
      text-align: center;
      color: #94a3b8;
      font-size: 12px;
      margin-top: 50px;
      border-top: 1px solid #e2e8f0;
      padding-top: 20px;
    }
    @media print {
      body { margin: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="no-print" style="margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center;">
    <button onclick="window.print()" style="background: #7c3aed; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: bold; cursor: pointer;">
      🖨️ Guardar o Imprimir en PDF
    </button>
    <span style="font-size: 13px; color: #64748b;">Guía de estudio descargable de ProfesorIA</span>
  </div>

  <div class="header">
    <span class="badge">ProfesorIA • Cuaderno de Estudio Oficial</span>
    <h1>${lesson.lessonNumber} ${lesson.title}</h1>
    <div class="meta">
      <strong>Curso:</strong> ${courseTitle} | <strong>Ruta:</strong> ${unitTitle} | <strong>Tiempo estimado:</strong> ${lesson.durationMinutes} min
    </div>
  </div>

  <div class="section">
    <div class="section-title">💡 1. Fundamento Nuclear (Idea Clave)</div>
    <p style="white-space: pre-line;">${lesson.keyIdea}</p>
  </div>

  <div class="section">
    <div class="section-title">🎯 2. Aplicación Práctica en el Mundo Real</div>
    <p style="white-space: pre-line;">${lesson.appliedExample}</p>
  </div>

  <div class="section">
    <div class="section-title">✍️ 3. Actividad Práctica y Consigna</div>
    <p style="white-space: pre-line;">${lesson.practicalActivity}</p>
  </div>

  <div class="section">
    <div class="section-title">📝 4. Cuestionario de Autoevaluación</div>
    ${lesson.quickQuiz.map((q, idx) => `
      <div class="quiz-card">
        <strong>${idx + 1}. ${q.question}</strong>
        <div class="options">
          ${q.options.map((opt, oIdx) => `<div>${['A', 'B', 'C', 'D'][oIdx]}) ${opt}</div>`).join('')}
        </div>
        <div style="margin-top: 10px; font-size: 12px; color: #047857; background: #ecfdf5; padding: 6px 10px; border-radius: 6px;">
          <strong>Respuesta correcta:</strong> Opción ${['A', 'B', 'C', 'D'][q.correctOptionIndex]} — ${q.explanation}
        </div>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    ProfesorIA – Aula Virtual • Documento pedagógico generado automáticamente • Material con fines educativos
  </div>
</body>
</html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

/**
 * Creates default downloadable attachments for any lesson.
 */
export function buildDefaultLessonAttachments(lesson: Lesson): LessonAttachment[] {
  return [
    {
      id: `att-ebook-${lesson.id}`,
      title: `Ebook de Estudio: ${lesson.title}`,
      type: 'ebook',
      fileName: `Guia_Estudio_${lesson.lessonNumber.replace(/\./g, '_')}.pdf`,
      fileSizeFormatted: '185 KB',
      description: 'Guía editorial completa con fundamentos teóricos, diagramas explicativos, glosario y resumen imprimible.',
      uploadedAt: 'Generado automáticamente'
    },
    {
      id: `att-excel-${lesson.id}`,
      title: `Plantilla de Práctica Excel: ${lesson.title}`,
      type: 'excel',
      fileName: `Ejercicio_${lesson.lessonNumber.replace(/\./g, '_')}.xlsx`,
      fileSizeFormatted: '45 KB',
      description: 'Libro de trabajo con tabla de datos de partida, columnas de resolución para el alumno y matriz de autoevaluación.',
      uploadedAt: 'Generado automáticamente'
    }
  ];
}
