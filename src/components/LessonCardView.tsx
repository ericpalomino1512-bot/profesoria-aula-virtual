import React, { useState } from 'react';
import { 
  Lightbulb, 
  Sparkles, 
  PenTool, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  Check 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Lesson, Unit, LessonAttachment } from '../types/course';
import { LessonVideoPlayer } from './LessonVideoPlayer';
import { LessonMaterialsSection } from './LessonMaterialsSection';

interface LessonCardViewProps {
  lesson: Lesson;
  unit: Unit;
  courseTitle: string;
  isCompleted: boolean;
  onToggleComplete: () => void;
  onPrevLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevLesson: boolean;
  hasNextLesson: boolean;
  savedQuizAnswers?: Record<string, number>;
  onSaveQuizAnswer: (questionId: string, optionIndex: number) => void;
  attachments?: LessonAttachment[];
  onAddAttachment: (att: LessonAttachment) => void;
  onRemoveAttachment: (attId: string) => void;
}

export const LessonCardView: React.FC<LessonCardViewProps> = ({
  lesson,
  unit,
  courseTitle,
  isCompleted,
  onToggleComplete,
  onPrevLesson,
  onNextLesson,
  hasPrevLesson,
  hasNextLesson,
  savedQuizAnswers = {},
  onSaveQuizAnswer,
  attachments = [],
  onAddAttachment,
  onRemoveAttachment,
}) => {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>(savedQuizAnswers);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    const updated = { ...selectedAnswers, [questionId]: optionIndex };
    setSelectedAnswers(updated);
    onSaveQuizAnswer(questionId, optionIndex);

    // If answer is correct, light sparkle confetti
    const question = lesson.quickQuiz.find(q => q.id === questionId);
    if (question && question.correctOptionIndex === optionIndex) {
      try {
        confetti({
          particleCount: 25,
          spread: 60,
          origin: { y: 0.8 },
          colors: ['#8b5cf6', '#10b981', '#6366f1']
        });
      } catch (e) {
        // Safe fallback
      }
    }
  };

  const handleMarkCompleteWithConfetti = () => {
    if (!isCompleted) {
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.7 },
          colors: ['#7c3aed', '#ec4899', '#3b82f6', '#10b981']
        });
      } catch (e) {}
    }
    onToggleComplete();
  };

  // Option letters mapping
  const letters = ['A', 'B', 'C', 'D'];

  return (
    <div className="space-y-6">
      
      {/* Lesson Header Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-7 transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                Unidad {unit.unitNumber}: {unit.title}
              </span>
              <span className="text-slate-300 dark:text-slate-600">•</span>
              <span className="inline-flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3.5 h-3.5" />
                {lesson.durationMinutes} min de lectura activa
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              <span className="text-violet-600 dark:text-violet-400 font-extrabold mr-2">
                {lesson.lessonNumber}
              </span>
              {lesson.title}
            </h2>
          </div>

          {/* Mark completed toggle button */}
          <button
            onClick={handleMarkCompleteWithConfetti}
            className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300 border border-violet-200 dark:border-violet-800 hover:bg-violet-100 dark:hover:bg-violet-900/60'
            }`}
          >
            {isCompleted ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Lección completada</span>
              </>
            ) : (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-violet-500" />
                <span>Marcar como completada</span>
              </>
            )}
          </button>

        </div>
      </div>

      {/* NEW: Generador y Reproductor de Video Instructivo */}
      <LessonVideoPlayer 
        lesson={lesson} 
        unitTitle={unit.title} 
      />

      {/* BLOCK 1: Idea Clave */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-200/60 dark:border-amber-800/60">
            <Lightbulb className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
              Bloque Teórico Nuclear
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Idea Clave
            </h3>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
            {lesson.keyIdea}
          </p>
        </div>
      </div>

      {/* BLOCK 2: Ejemplo Aplicado */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center border border-indigo-200/60 dark:border-indigo-800/60">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              En el mundo real
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Ejemplo Aplicado
            </h3>
          </div>
        </div>

        <div className="prose dark:prose-invert max-w-none">
          <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed font-normal whitespace-pre-line">
            {lesson.appliedExample}
          </p>
        </div>
      </div>

      {/* BLOCK 3: Actividad Práctica */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200/60 dark:border-emerald-800/60">
            <PenTool className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Ponte a prueba
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Actividad Práctica
            </h3>
          </div>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/40">
          <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
            {lesson.practicalActivity}
          </p>
        </div>
      </div>

      {/* BLOCK 4: Test Rápido */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center border border-violet-200/60 dark:border-violet-800/60">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Comprobación de aprendizaje
              </span>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Test Rápido (3 Preguntas)
              </h3>
            </div>
          </div>
        </div>

        {/* 3 Questions */}
        <div className="space-y-6">
          {lesson.quickQuiz.map((quiz, qIndex) => {
            const hasAnswered = selectedAnswers[quiz.id] !== undefined;
            const chosenOption = selectedAnswers[quiz.id];
            const isCorrect = chosenOption === quiz.correctOptionIndex;

            return (
              <div 
                key={quiz.id}
                className="p-5 rounded-2xl bg-slate-50/60 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800/80 space-y-4"
              >
                {/* Question title */}
                <h4 className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-snug">
                  <span className="text-violet-600 dark:text-violet-400 mr-2">
                    {qIndex + 1}.
                  </span>
                  {quiz.question}
                </h4>

                {/* 4 Options */}
                <div className="grid grid-cols-1 gap-2.5">
                  {quiz.options.map((option, oIndex) => {
                    const isSelected = chosenOption === oIndex;
                    const isTheCorrectOne = quiz.correctOptionIndex === oIndex;

                    let btnClass = 'bg-white dark:bg-slate-800/90 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-violet-300 dark:hover:border-violet-700';

                    if (hasAnswered) {
                      if (isSelected) {
                        btnClass = isCorrect
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-500'
                          : 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-900 dark:text-rose-200 ring-1 ring-rose-500';
                      } else if (isTheCorrectOne) {
                        btnClass = 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300';
                      } else {
                        btnClass = 'opacity-60 bg-white dark:bg-slate-800/50 border-slate-200 dark:border-slate-700';
                      }
                    }

                    return (
                      <button
                        key={oIndex}
                        type="button"
                        onClick={() => handleSelectOption(quiz.id, oIndex)}
                        className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-start gap-3 ${btnClass}`}
                      >
                        <span className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-500 text-white'
                              : 'bg-rose-500 text-white'
                            : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                        }`}>
                          {letters[oIndex]}
                        </span>
                        <span className="flex-1">{option}</span>
                        {hasAnswered && isSelected && (
                          <span className="shrink-0 mt-0.5">
                            {isCorrect ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            ) : (
                              <XCircle className="w-4 h-4 text-rose-500" />
                            )}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on answer */}
                {hasAnswered && (
                  <div className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed border animate-in fade-in ${
                    isCorrect
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                      : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                  }`}>
                    <strong className="font-semibold block mb-1">
                      {isCorrect ? '¡Excelente!' : 'Revisión pedagógica:'}
                    </strong>
                    {quiz.explanation}
                  </div>
                )}

              </div>
            );
          })}
        </div>
      </div>

      {/* NEW: Materiales Descargables y Adjuntos (Ebook, Excel, PDFs) */}
      <LessonMaterialsSection
        lesson={lesson}
        courseTitle={courseTitle}
        unitTitle={unit.title}
        attachments={attachments}
        onAddAttachment={onAddAttachment}
        onRemoveAttachment={onRemoveAttachment}
      />

      {/* Navigation Footer Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3">
        
        <button
          onClick={onPrevLesson}
          disabled={!hasPrevLesson}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Lección anterior</span>
        </button>

        {/* Center mark complete */}
        <button
          onClick={handleMarkCompleteWithConfetti}
          className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
            isCompleted
              ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-xs'
              : 'bg-violet-600 text-white hover:bg-violet-500 shadow-md shadow-violet-500/20'
          }`}
        >
          <Check className="w-4 h-4" />
          <span>{isCompleted ? 'Lección marcada como completada' : 'Marcar como completada'}</span>
        </button>

        <button
          onClick={onNextLesson}
          disabled={!hasNextLesson}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <span>Siguiente lección</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>

    </div>
  );
};
