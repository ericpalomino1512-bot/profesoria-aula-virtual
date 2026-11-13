import React, { useState, useMemo } from 'react';
import type { Course, Lesson, Unit, CourseProgress, LessonAttachment } from '../types/course';
import { CourseHeader } from './CourseHeader';
import { CourseSidebar } from './CourseSidebar';
import type { ActiveSectionType } from './CourseSidebar';
import { LessonCardView } from './LessonCardView';
import { FinalAssessmentView } from './FinalAssessmentView';
import { FinalProjectsView } from './FinalProjectsView';
import { SourcesView } from './SourcesView';
import { Lock, ArrowLeft, AlertCircle } from 'lucide-react';

interface CourseViewProps {
  course: Course;
  isEnrolled?: boolean;
  onEnroll?: (course: Course) => void;
  onBackToDetails?: () => void;
  initialLessonId?: string;
}

export const CourseView: React.FC<CourseViewProps> = ({ 
  course, 
  isEnrolled = true,
  onEnroll,
  onBackToDetails,
  initialLessonId
}) => {
  // Flat list of all lessons with unit references for seamless next/prev navigation
  const flatLessons = useMemo(() => {
    const list: { lesson: Lesson; unit: Unit; index: number }[] = [];
    course.units.forEach((unit) => {
      unit.lessons.forEach((lesson) => {
        list.push({ lesson, unit, index: list.length });
      });
    });
    return list;
  }, [course]);

  // Current active lesson & section
  const [activeLessonId, setActiveLessonId] = useState<string>(
    initialLessonId || flatLessons[0]?.lesson.id || ''
  );
  const [activeSection, setActiveSection] = useState<ActiveSectionType>('lesson');

  // Course progress in local storage / component state
  const [progress, setProgress] = useState<CourseProgress>(() => {
    const saved = localStorage.getItem(`progress_${course.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return {
      completedLessonIds: [],
      quizAnswers: {},
      finalAssessmentAnswers: {},
      finalAssessmentSubmitted: false,
      lessonAttachments: {}
    };
  });

  const saveProgress = (newProgress: CourseProgress) => {
    setProgress(newProgress);
    localStorage.setItem(`progress_${course.id}`, JSON.stringify(newProgress));
  };

  // Find active lesson object and unit
  const currentFlatItem = useMemo(() => {
    return flatLessons.find(item => item.lesson.id === activeLessonId) || flatLessons[0];
  }, [flatLessons, activeLessonId]);

  const currentIndex = currentFlatItem ? currentFlatItem.index : 0;
  const hasPrevLesson = currentIndex > 0;
  const hasNextLesson = currentIndex < flatLessons.length - 1;

  // Find next uncompleted lesson for "Continuar donde lo dejé"
  const nextPendingItem = useMemo(() => {
    const found = flatLessons.find(item => !progress.completedLessonIds.includes(item.lesson.id));
    return found || flatLessons[0];
  }, [flatLessons, progress.completedLessonIds]);

  const handleContinueLearning = () => {
    if (nextPendingItem) {
      setActiveLessonId(nextPendingItem.lesson.id);
      setActiveSection('lesson');
    } else {
      setActiveSection('final-assessment');
    }
  };

  const handleSelectLesson = (lesson: Lesson, _unit: Unit) => {
    setActiveLessonId(lesson.id);
    setActiveSection('lesson');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectSection = (section: ActiveSectionType) => {
    setActiveSection(section);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleCompleteLesson = () => {
    if (!currentFlatItem) return;
    const lessonId = currentFlatItem.lesson.id;
    const isCompleted = progress.completedLessonIds.includes(lessonId);

    const updatedCompleted = isCompleted
      ? progress.completedLessonIds.filter(id => id !== lessonId)
      : [...progress.completedLessonIds, lessonId];

    saveProgress({
      ...progress,
      completedLessonIds: updatedCompleted
    });
  };

  const handlePrevLesson = () => {
    if (hasPrevLesson) {
      const prev = flatLessons[currentIndex - 1];
      setActiveLessonId(prev.lesson.id);
      setActiveSection('lesson');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleNextLesson = () => {
    if (hasNextLesson) {
      const next = flatLessons[currentIndex + 1];
      setActiveLessonId(next.lesson.id);
      setActiveSection('lesson');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // If was on last lesson, open final assessment
      setActiveSection('final-assessment');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveQuizAnswer = (questionId: string, optionIndex: number) => {
    saveProgress({
      ...progress,
      quizAnswers: {
        ...progress.quizAnswers,
        [questionId]: optionIndex
      }
    });
  };

  const handleSaveAssessmentAnswer = (questionId: string, optionIndex: number) => {
    saveProgress({
      ...progress,
      finalAssessmentAnswers: {
        ...progress.finalAssessmentAnswers,
        [questionId]: optionIndex
      }
    });
  };

  const handleSubmitAssessment = () => {
    saveProgress({
      ...progress,
      finalAssessmentSubmitted: true
    });
  };

  const handleAddAttachment = (att: LessonAttachment) => {
    if (!currentFlatItem) return;
    const lessonId = currentFlatItem.lesson.id;
    const currentAtts = progress.lessonAttachments?.[lessonId] || [];
    const updated = {
      ...(progress.lessonAttachments || {}),
      [lessonId]: [...currentAtts, att]
    };
    saveProgress({
      ...progress,
      lessonAttachments: updated
    });
  };

  const handleRemoveAttachment = (attId: string) => {
    if (!currentFlatItem) return;
    const lessonId = currentFlatItem.lesson.id;
    const currentAtts = progress.lessonAttachments?.[lessonId] || [];
    const updated = {
      ...(progress.lessonAttachments || {}),
      [lessonId]: currentAtts.filter(a => a.id !== attId)
    };
    saveProgress({
      ...progress,
      lessonAttachments: updated
    });
  };

  const isCurrentLessonLocked = !isEnrolled && currentFlatItem && currentFlatItem.index > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
      
      {/* Back to course details / catalog navigation button */}
      <div className="flex items-center justify-between">
        {onBackToDetails && (
          <button
            onClick={onBackToDetails}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-violet-600 dark:hover:text-violet-400 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver a la Ficha del Curso (Detalles)</span>
          </button>
        )}

        {!isEnrolled && (
          <button
            onClick={() => onEnroll && onEnroll(course)}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-violet-500/20 cursor-pointer"
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Inscribirme en el curso</span>
          </button>
        )}
      </div>

      {/* Preview Mode Alert Banner */}
      {!isEnrolled && (
        <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>
              <strong>Modo Vista Previa:</strong> Solo la primera lección (1.1) está disponible de forma gratuita. Inscríbete para desbloquear el temario completo, guardar tu progreso y obtener el certificado.
            </span>
          </div>

          <button
            onClick={() => onEnroll && onEnroll(course)}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            Inscribirme Gratis
          </button>
        </div>
      )}

      {/* 1) Cabecera superior del curso */}
      <CourseHeader
        course={course}
        completedLessonsCount={progress.completedLessonIds.length}
        totalLessonsCount={flatLessons.length}
        onContinueLearning={handleContinueLearning}
        nextLessonTitle={nextPendingItem?.lesson.title}
      />

      {/* Main 2-column Layout: Left Sidebar + Main Lesson Area */}
      <div className="flex flex-col lg:flex-row items-start gap-8">
        
        {/* 2) Barra lateral izquierda con el plan de estudios */}
        <CourseSidebar
          units={course.units}
          activeLessonId={activeLessonId}
          activeSection={activeSection}
          completedLessonIds={progress.completedLessonIds}
          isEnrolled={isEnrolled}
          onSelectLesson={handleSelectLesson}
          onSelectSection={handleSelectSection}
          isAssessmentSubmitted={progress.finalAssessmentSubmitted}
        />

        {/* 3) Zona principal de contenido con las tarjetas */}
        <main className="flex-1 w-full min-w-0">
          
          {activeSection === 'lesson' && currentFlatItem && (
            isCurrentLessonLocked ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Contenido Bloqueado • Requiere Inscripción
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    {currentFlatItem.lesson.lessonNumber}. {currentFlatItem.lesson.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Esta lección forma parte del programa oficial. Para acceder a las explicaciones pedagógicas completas, videos interactivos con IA y materiales descargables en Excel y PDF, inscríbete en el curso.
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={() => onEnroll && onEnroll(course)}
                    className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-500/25 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Inscribirme en el curso ahora</span>
                  </button>

                  <button
                    onClick={() => {
                      if (flatLessons[0]) {
                        setActiveLessonId(flatLessons[0].lesson.id);
                        setActiveSection('lesson');
                      }
                    }}
                    className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs sm:text-sm font-semibold transition-colors cursor-pointer"
                  >
                    <span>Volver a la Lección Gratuita 1.1</span>
                  </button>
                </div>
              </div>
            ) : (
              <LessonCardView
                lesson={currentFlatItem.lesson}
                unit={currentFlatItem.unit}
                courseTitle={course.title}
                isCompleted={progress.completedLessonIds.includes(currentFlatItem.lesson.id)}
                isEnrolled={isEnrolled}
                onToggleComplete={handleToggleCompleteLesson}
                onPrevLesson={handlePrevLesson}
                onNextLesson={handleNextLesson}
                onEnroll={() => onEnroll && onEnroll(course)}
                hasPrevLesson={hasPrevLesson}
                hasNextLesson={hasNextLesson}
                savedQuizAnswers={progress.quizAnswers}
                onSaveQuizAnswer={handleSaveQuizAnswer}
                attachments={progress.lessonAttachments?.[currentFlatItem.lesson.id] || []}
                onAddAttachment={handleAddAttachment}
                onRemoveAttachment={handleRemoveAttachment}
              />
            )
          )}

          {activeSection === 'final-assessment' && (
            !isEnrolled ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Evaluación Final Bloqueada
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Para presentar el examen final y obtener tu certificado descargable, debes inscribirte como alumno en el curso.
                  </p>
                </div>
                <button
                  onClick={() => onEnroll && onEnroll(course)}
                  className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-500/25"
                >
                  Inscribirme para Desbloquear Evaluación
                </button>
              </div>
            ) : (
              <FinalAssessmentView
                questions={course.finalAssessment}
                savedAnswers={progress.finalAssessmentAnswers}
                isSubmitted={progress.finalAssessmentSubmitted}
                onSaveAnswer={handleSaveAssessmentAnswer}
                onSubmitAssessment={handleSubmitAssessment}
              />
            )
          )}

          {activeSection === 'final-projects' && (
            !isEnrolled ? (
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 text-center space-y-6 shadow-sm">
                <div className="w-16 h-16 mx-auto rounded-3xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <Lock className="w-8 h-8" />
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                    Proyectos Prácticos Bloqueados
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    Los entregables y casos de aplicación inmobiliaria son exclusivos para alumnos matriculados.
                  </p>
                </div>
                <button
                  onClick={() => onEnroll && onEnroll(course)}
                  className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-violet-500/25"
                >
                  Inscribirme para Acceder a Proyectos
                </button>
              </div>
            ) : (
              <FinalProjectsView projects={course.finalProjects} />
            )
          )}

          {activeSection === 'sources' && (
            <SourcesView sources={course.sourcesAndReferences} />
          )}

        </main>

      </div>

    </div>
  );
};
