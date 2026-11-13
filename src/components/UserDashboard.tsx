import React from 'react';
import type { StudentUser, Course, CourseProgress } from '../types/course';
import { getCourseThumbnail } from '../utils/courseImages';
import { 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  Users, 
  Tag, 
  ArrowRight
} from 'lucide-react';

interface UserDashboardProps {
  currentUser: StudentUser;
  catalogCourses: Course[];
  enrolledCourses: Course[];
  progressMap: Record<string, CourseProgress>;
  onSelectCourse: (course: Course) => void;
  onOpenCreator: () => void;
  onExploreCatalog: () => void;
}

export const UserDashboard: React.FC<UserDashboardProps> = ({
  currentUser,
  catalogCourses,
  enrolledCourses,
  progressMap,
  onSelectCourse,
  onOpenCreator,
  onExploreCatalog,
}) => {
  const isTeacher = currentUser.role === 'admin' || currentUser.role === 'teacher';

  // For teachers: Courses created/managed
  const teacherCourses = isTeacher ? catalogCourses : [];

  // Calculate completed courses
  const completedCoursesCount = enrolledCourses.filter(c => {
    const prog = progressMap[c.id];
    const total = c.units.reduce((acc, u) => acc + u.lessons.length, 0);
    return total > 0 && (prog?.completedLessonIds?.length || 0) >= total;
  }).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8 animate-in fade-in duration-300">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-violet-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 shadow-xl border border-violet-500/20">
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/30 text-xs font-bold text-violet-200">
              <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
              <span>{isTeacher ? 'Panel de Control Docente & Administrador' : 'Panel de Control del Alumno'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
              ¡Hola, {currentUser.name}!
            </h1>
            <p className="text-xs sm:text-sm text-violet-100/80 max-w-xl">
              {isTeacher
                ? 'Gestiona tus cursos creados, supervisa los contenidos de la academia y diseña nuevas rutas con IA.'
                : 'Continúa tus programas inmobiliarios, revisa nuevas promociones y descarga tus certificados.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
            {isTeacher ? (
              <button
                onClick={onOpenCreator}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Crear Nuevo Curso</span>
              </button>
            ) : (
              <button
                onClick={onExploreCatalog}
                className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-500/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
              >
                <BookOpen className="w-4 h-4" />
                <span>Explorar Nuevos Cursos</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isTeacher ? 'Cursos Publicados' : 'Cursos Matriculados'}
          </span>
          <p className="text-2xl font-black text-slate-900 dark:text-white">
            {isTeacher ? teacherCourses.length : enrolledCourses.length}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {isTeacher ? 'Tipo de Cuenta' : 'Cursos Completados'}
          </span>
          <p className="text-2xl font-black text-violet-600 dark:text-violet-400">
            {isTeacher ? 'Docente Titular' : `${completedCoursesCount} de ${enrolledCourses.length}`}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Estado de Membresía</span>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            Activo
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Campus Cloud</span>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-200">
            Supabase
          </p>
        </div>
      </div>

      {/* Teacher Dashboard View: Managed Courses */}
      {isTeacher ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-violet-600" />
              <span>Mis Cursos Diseñados y Publicados</span>
            </h2>
            <button
              onClick={onOpenCreator}
              className="text-xs text-violet-600 dark:text-violet-400 font-bold hover:underline"
            >
              + Diseñar otro curso
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {teacherCourses.map((c) => (
              <div
                key={c.id}
                className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-violet-300 transition-colors flex flex-col justify-between"
              >
                <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                  <img 
                    src={getCourseThumbnail(c)} 
                    alt={c.title} 
                    className="w-full h-full object-cover" 
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-violet-300 backdrop-blur-xs">
                      {c.level}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="text-xs font-bold text-white bg-emerald-600 px-2 py-0.5 rounded-md shadow-xs">
                      {c.price ? `$${c.price} USD` : 'Gratuito'}
                    </span>
                  </div>
                </div>

                <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {c.title}
                    </h3>
                    <p className="text-[11px] text-slate-500 line-clamp-2">
                      {c.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => onSelectCourse(c)}
                      className="w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center"
                    >
                      Ver en el Aula Virtual
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Student Dashboard: Promotions & Announcements */
        <div className="space-y-6">
          
          {/* Active Promotions & Announcements */}
          <div className="p-6 rounded-3xl bg-linear-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 border border-amber-200 dark:border-amber-900/50 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 dark:text-amber-300">
              <Tag className="w-4 h-4 text-amber-600" />
              <span>Promociones Especiales para Alumnos Matriculados</span>
            </div>
            <h3 className="text-base font-bold text-amber-950 dark:text-amber-100">
              50% de Descuento en tu Próxima Especialización Inmobiliaria
            </h3>
            <p className="text-xs text-amber-900/80 dark:text-amber-200/80 leading-relaxed max-w-2xl">
              Por ser parte activa del Campus TusCursosInmobiliarios, accede a los nuevos programas avanzados con certificado descargable al finalizar. Usa el cupón <strong>CAMPUS2026</strong> al inscribirte.
            </p>
          </div>

          {/* Enrolled Courses preview */}
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-violet-600" />
              <span>Mis Cursos Activos</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {enrolledCourses.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img 
                      src={getCourseThumbnail(c)} 
                      alt={c.title} 
                      className="w-full h-full object-cover" 
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-900/80 text-violet-300 backdrop-blur-xs">
                        {c.level}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {c.title}
                    </h3>
                    <button
                      onClick={() => onSelectCourse(c)}
                      className="w-full py-2 px-3 rounded-xl bg-violet-600 text-white hover:bg-violet-500 text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                    >
                      <span>Continuar Aprendizaje</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
