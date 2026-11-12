import React, { useState, useMemo } from 'react';
import type { Course, Lesson, Unit, CourseProgress, LessonAttachment } from '../types/course';
import { CourseHeader } from './CourseHeader';
import { CourseSidebar } from './CourseSidebar';
import type { ActiveSectionType } from './CourseSidebar';
import { LessonCardView } from './LessonCardView';
import { FinalAssessmentView } from './FinalAssessmentView';
import { FinalProjectsView } from './FinalProjectsView';
import { SourcesView } from './SourcesView';

interface CourseViewProps {
  course: Course;
}

export const CourseView: React.FC<CourseViewProps> = ({ course }) => {
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
    flatLessons[0]?.lesson.id || ''
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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      
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
          onSelectLesson={handleSelectLesson}
          onSelectSection={handleSelectSection}
          isAssessmentSubmitted={progress.finalAssessmentSubmitted}
        />

        {/* 3) Zona principal de contenido con las tarjetas */}
        <main className="flex-1 w-full min-w-0">
          
          {activeSection === 'lesson' && currentFlatItem && (
            <LessonCardView
              lesson={currentFlatItem.lesson}
              unit={currentFlatItem.unit}
              courseTitle={course.title}
              isCompleted={progress.completedLessonIds.includes(currentFlatItem.lesson.id)}
              onToggleComplete={handleToggleCompleteLesson}
              onPrevLesson={handlePrevLesson}
              onNextLesson={handleNextLesson}
              hasPrevLesson={hasPrevLesson}
              hasNextLesson={hasNextLesson}
              savedQuizAnswers={progress.quizAnswers}
              onSaveQuizAnswer={handleSaveQuizAnswer}
              attachments={progress.lessonAttachments?.[currentFlatItem.lesson.id] || []}
              onAddAttachment={handleAddAttachment}
              onRemoveAttachment={handleRemoveAttachment}
            />
          )}

          {activeSection === 'final-assessment' && (
            <FinalAssessmentView
              questions={course.finalAssessment}
              savedAnswers={progress.finalAssessmentAnswers}
              isSubmitted={progress.finalAssessmentSubmitted}
              onSaveAnswer={handleSaveAssessmentAnswer}
              onSubmitAssessment={handleSubmitAssessment}
            />
          )}

          {activeSection === 'final-projects' && (
            <FinalProjectsView projects={course.finalProjects} />
          )}

          {activeSection === 'sources' && (
            <SourcesView sources={course.sourcesAndReferences} />
          )}

        </main>

      </div>

    </div>
  );
};
