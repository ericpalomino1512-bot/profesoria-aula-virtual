import React, { useState } from 'react';
import { 
  GraduationCap, 
  Clock, 
  User, 
  Layers, 
  BookOpen, 
  PlayCircle, 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Award,
  Sparkles
} from 'lucide-react';
import type { Course } from '../types/course';

interface CourseHeaderProps {
  course: Course;
  completedLessonsCount: number;
  totalLessonsCount: number;
  onContinueLearning: () => void;
  nextLessonTitle?: string;
}

export const CourseHeader: React.FC<CourseHeaderProps> = ({
  course,
  completedLessonsCount,
  totalLessonsCount,
  onContinueLearning,
  nextLessonTitle,
}) => {
  const [showObjectives, setShowObjectives] = useState(true);

  const percentage = totalLessonsCount > 0 
    ? Math.round((completedLessonsCount / totalLessonsCount) * 100) 
    : 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-8 transition-colors mb-6">
      
      {/* Top badges */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-violet-100 text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 border border-violet-200/80 dark:border-violet-800">
          <GraduationCap className="w-3.5 h-3.5" />
          {course.level}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Clock className="w-3.5 h-3.5 text-slate-500" />
          {course.estimatedDuration}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <User className="w-3.5 h-3.5 text-slate-500" />
          {course.targetProfile}
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <Layers className="w-3.5 h-3.5 text-slate-500" />
          {course.units.length} Unidades
        </span>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <BookOpen className="w-3.5 h-3.5 text-slate-500" />
          {totalLessonsCount} Lecciones
        </span>
      </div>

      {/* Main Title & Subtitle */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
            {course.title}
          </h1>
          <p className="mt-2.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
            {course.subtitle}
          </p>
        </div>

        {/* Continue button */}
        <div className="shrink-0 lg:self-center">
          <button
            onClick={onContinueLearning}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-semibold text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-md shadow-violet-500/20 active:scale-95 transition-all text-sm group"
          >
            <PlayCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <div className="text-left">
              <span className="block font-bold">Continuar donde lo dejé</span>
              {nextLessonTitle && (
                <span className="block text-[11px] font-normal text-violet-100 truncate max-w-[200px]">
                  {nextLessonTitle}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Global Course Progress Bar */}
      <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
        <div className="flex items-center justify-between text-xs sm:text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Progreso global del aula</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-500 dark:text-slate-400">
              {completedLessonsCount} de {totalLessonsCount} lecciones completadas
            </span>
            <span className="font-bold text-violet-600 dark:text-violet-400 text-sm">
              {percentage}%
            </span>
          </div>
        </div>

        <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden p-0.5 border border-slate-200/60 dark:border-slate-700/60">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-500 to-indigo-500 transition-all duration-500 shadow-xs"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Learning objectives block */}
      <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
        <button
          type="button"
          onClick={() => setShowObjectives(!showObjectives)}
          className="w-full flex items-center justify-between text-left text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-violet-600 dark:hover:text-violet-400 py-1 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-500" />
            <span>Objetivos de aprendizaje del curso ({course.learningObjectives.length})</span>
          </div>
          {showObjectives ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showObjectives && (
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2.5 animate-in fade-in slide-in-from-top-1">
            {course.learningObjectives.map((objective, idx) => (
              <div 
                key={idx} 
                className="flex items-start gap-2.5 p-2.5 rounded-xl bg-violet-50/50 dark:bg-violet-950/20 border border-violet-100/60 dark:border-violet-900/30 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>{objective}</span>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
