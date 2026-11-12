import React from 'react';
import type { Course, CourseProgress } from '../types/course';
import { 
  PlayCircle, 
  Award, 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Clock,
  Layers
} from 'lucide-react';

interface MyCoursesViewProps {
  enrolledCourses: Course[];
  progressMap: Record<string, CourseProgress>;
  onSelectCourse: (course: Course) => void;
  onExploreCatalog: () => void;
}

export const MyCoursesView: React.FC<MyCoursesViewProps> = ({
  enrolledCourses,
  progressMap,
  onSelectCourse,
  onExploreCatalog,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-100 dark:bg-violet-950/60 text-xs font-bold text-violet-700 dark:text-violet-300 mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Mi Aula Personal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Mis Cursos y Avance
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
            Continúa tus lecciones donde las dejaste y descarga tus materiales de estudio.
          </p>
        </div>

        <button
          onClick={onExploreCatalog}
          className="px-4 py-2 text-xs font-bold rounded-xl text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/40 hover:bg-violet-100 dark:hover:bg-violet-900/50 border border-violet-200 dark:border-violet-800 flex items-center gap-2 transition-colors"
        >
          <span>Ver catálogo completo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Enrolled Courses Grid */}
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
            <Award className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">
            Aún no estás inscrito en ningún curso
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Explora nuestro catálogo interactivo para empezar tu primera lección gratuita con inteligencia artificial.
          </p>
          <button
            onClick={onExploreCatalog}
            className="px-5 py-2.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-500/20"
          >
            Explorar Catálogo de Cursos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => {
            const progress = progressMap[course.id];
            const completedCount = progress?.completedLessonIds?.length || 0;
            const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
            const percent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
            const isCompleted = percent === 100;

            return (
              <div
                key={course.id}
                className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 hover:border-violet-400 dark:hover:border-violet-700 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden"
              >
                {/* Header Badge */}
                <div className="p-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300">
                    {course.level}
                  </span>

                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                    {percent}% completado
                  </span>
                </div>

                {/* Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                      {course.subtitle}
                    </p>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-500 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-violet-600'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{completedCount} de {totalLessons} lecciones</span>
                      {isCompleted ? (
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" /> ¡Completado!
                        </span>
                      ) : (
                        <span>En progreso</span>
                      )}
                    </div>
                  </div>

                  {/* Metadata */}
                  <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 space-y-1 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="truncate">{course.estimatedDuration}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers className="w-3 h-3 text-slate-400" />
                      <span>{course.units.length} módulos estructurados</span>
                    </div>
                  </div>

                  {/* Action */}
                  <button
                    onClick={() => onSelectCourse(course)}
                    className="w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-500/20 transition-transform active:scale-95"
                  >
                    <PlayCircle className="w-4 h-4" />
                    <span>{percent > 0 ? 'Continuar Lección' : 'Comenzar Curso'}</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
