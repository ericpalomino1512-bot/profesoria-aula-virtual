import React from 'react';
import { 
  CheckCircle, 
  Circle, 
  ChevronRight, 
  Briefcase, 
  ExternalLink,
  BookOpen,
  Award,
  Lock
} from 'lucide-react';
import type { Unit, Lesson } from '../types/course';

export type ActiveSectionType = 'lesson' | 'final-assessment' | 'final-projects' | 'sources';

interface CourseSidebarProps {
  units: Unit[];
  activeLessonId: string;
  activeSection: ActiveSectionType;
  completedLessonIds: string[];
  isEnrolled?: boolean;
  onSelectLesson: (lesson: Lesson, unit: Unit) => void;
  onSelectSection: (section: ActiveSectionType) => void;
  isAssessmentSubmitted?: boolean;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  units,
  activeLessonId,
  activeSection,
  completedLessonIds,
  isEnrolled = true,
  onSelectLesson,
  onSelectSection,
  isAssessmentSubmitted,
}) => {
  return (
    <aside className="w-full lg:w-80 shrink-0 bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-4 sm:p-5 flex flex-col gap-6 transition-colors">
      
      {/* Sidebar header */}
      <div className="pb-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
            Plan de Estudios
          </h2>
        </div>
        <span className="text-[11px] font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/60 px-2 py-0.5 rounded-full">
          {units.length} Rutas
        </span>
      </div>

      {!isEnrolled && (
        <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-[11px] text-amber-800 dark:text-amber-300 flex items-start gap-2">
          <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>Estás en <strong>Vista Previa</strong>. Inscríbete para desbloquear todo el curso.</span>
        </div>
      )}

      {/* Units and Lessons scrollable list */}
      <div className="space-y-5 max-h-[calc(100vh-22rem)] overflow-y-auto pr-1">
        {units.map((unit, unitIdx) => {
          const unitCompletedCount = unit.lessons.filter(l => completedLessonIds.includes(l.id)).length;

          return (
            <div key={unit.id} className="space-y-1.5">
              
              {/* Unit Title and meta */}
              <div className="px-2 py-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    Unidad {unit.unitNumber}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400 font-medium">
                    {unitCompletedCount}/{unit.lessons.length}
                  </span>
                </div>
                <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200 line-clamp-1 mt-0.5">
                  {unit.title}
                </h3>
              </div>

              {/* Lesson items */}
              <div className="space-y-1">
                {unit.lessons.map((lesson, lessonIdx) => {
                  const isActive = activeSection === 'lesson' && activeLessonId === lesson.id;
                  const isCompleted = completedLessonIds.includes(lesson.id);
                  const isFreePreview = unitIdx === 0 && lessonIdx === 0;
                  const isLocked = !isEnrolled && !isFreePreview;

                  return (
                    <button
                      key={lesson.id}
                      onClick={() => onSelectLesson(lesson, unit)}
                      className={`w-full text-left flex items-start gap-2.5 px-3 py-2.5 rounded-xl text-xs transition-all relative group cursor-pointer ${
                        isActive
                          ? 'bg-violet-600 text-white font-semibold shadow-md shadow-violet-500/25 ring-1 ring-violet-500'
                          : isCompleted
                          ? 'bg-emerald-50/60 dark:bg-emerald-950/20 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          : isLocked
                          ? 'text-slate-400 dark:text-slate-500 hover:bg-slate-100/50 dark:hover:bg-slate-800/40'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-slate-200'
                      }`}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <span className="absolute left-0 top-2 bottom-2 w-1 bg-white rounded-r-full" />
                      )}

                      {/* Status Icon */}
                      <span className="shrink-0 mt-0.5">
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                        ) : isCompleted ? (
                          <CheckCircle className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-emerald-500 dark:text-emerald-400'}`} />
                        ) : isActive ? (
                          <span className="w-3.5 h-3.5 rounded-full border-2 border-white flex items-center justify-center">
                            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
                          </span>
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 group-hover:text-slate-400" />
                        )}
                      </span>

                      {/* Lesson title and number */}
                      <div className="flex-1 min-w-0">
                        <span className="line-clamp-2 leading-relaxed">
                          <strong className={isActive ? 'text-violet-100' : 'text-slate-600 dark:text-slate-400'}>
                            {lesson.lessonNumber}{' '}
                          </strong>
                          {lesson.title}
                        </span>
                      </div>

                      {isFreePreview && !isEnrolled && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300 shrink-0">
                          Gratis
                        </span>
                      )}

                    </button>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Special Course Sections: Assessment, Projects, Sources */}
      <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-1.5">
        <span className="block px-2 text-[10px] font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
          Cierre y Certificación
        </span>

        {/* Final Assessment */}
        <button
          onClick={() => onSelectSection('final-assessment')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'final-assessment'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
              : !isEnrolled
              ? 'text-slate-400 dark:text-slate-500 hover:bg-slate-100/50'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {!isEnrolled ? (
              <Lock className="w-4 h-4 text-slate-400" />
            ) : (
              <Award className={`w-4 h-4 ${activeSection === 'final-assessment' ? 'text-white' : 'text-amber-500'}`} />
            )}
            <span>Evaluación Final</span>
          </div>
          {isAssessmentSubmitted && (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/60 dark:text-emerald-300">
              Completado
            </span>
          )}
        </button>

        {/* Final Projects */}
        <button
          onClick={() => onSelectSection('final-projects')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            activeSection === 'final-projects'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
              : !isEnrolled
              ? 'text-slate-400 dark:text-slate-500 hover:bg-slate-100/50'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {!isEnrolled ? (
              <Lock className="w-4 h-4 text-slate-400" />
            ) : (
              <Briefcase className={`w-4 h-4 ${activeSection === 'final-projects' ? 'text-white' : 'text-indigo-500'}`} />
            )}
            <span>Proyectos Finales</span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'final-projects' ? 'text-white' : 'text-slate-400'}`} />
        </button>

        {/* Sources & References */}
        <button
          onClick={() => onSelectSection('sources')}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
            activeSection === 'sources'
              ? 'bg-violet-600 text-white shadow-md shadow-violet-500/20'
              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <div className="flex items-center gap-2">
            <ExternalLink className={`w-4 h-4 ${activeSection === 'sources' ? 'text-white' : 'text-cyan-500'}`} />
            <span>Fuentes y Referencias</span>
          </div>
          <ChevronRight className={`w-3.5 h-3.5 ${activeSection === 'sources' ? 'text-white' : 'text-slate-400'}`} />
        </button>
      </div>

    </aside>
  );
};
