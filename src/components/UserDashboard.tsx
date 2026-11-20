import React, { useState } from 'react';
import type { StudentUser, Course, CourseProgress } from '../types/course';
import { getCourseThumbnail } from '../utils/courseImages';
import { 
  GraduationCap, 
  BookOpen, 
  PlusCircle, 
  Users, 
  Tag, 
  Play,
  CheckCircle2,
  Award,
  Search
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
  const [studentTab, setStudentTab] = useState<'all' | 'in-progress' | 'completed' | 'certificates'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // For teachers: Courses created/managed
  const teacherCourses = isTeacher ? catalogCourses : [];

  // Course progress calculations
  const getCoursePercent = (c: Course): number => {
    const prog = progressMap[c.id];
    const total = c.units.reduce((acc, u) => acc + u.lessons.length, 0);
    if (!total) return 0;
    const completed = prog?.completedLessonIds?.length || 0;
    return Math.min(100, Math.round((completed / total) * 100));
  };

  const getCourseCompletedLessons = (c: Course): number => {
    const prog = progressMap[c.id];
    return prog?.completedLessonIds?.length || 0;
  };

  const completedCourses = enrolledCourses.filter(c => getCoursePercent(c) === 100);
  const inProgressCourses = enrolledCourses.filter(c => getCoursePercent(c) < 100);

  // Filtered enrolled courses for student view
  const displayedCourses = enrolledCourses.filter(c => {
    const pct = getCoursePercent(c);
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (c.category && c.category.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesSearch) return false;

    if (studentTab === 'in-progress') return pct < 100;
    if (studentTab === 'completed' || studentTab === 'certificates') return pct === 100;
    return true;
  });

  // Recommended next courses (catalog courses where user is not yet enrolled)
  const recommendedCourses = catalogCourses
    .filter(c => !enrolledCourses.some(ec => ec.id === c.id))
    .slice(0, 3);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 animate-in fade-in duration-300">
      
      {/* Udemy-style Dark Top Header Banner */}
      <div className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-xl shadow-violet-500/25 border-2 border-white/10 shrink-0">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/20 text-xs font-bold text-violet-300 border border-violet-500/30 mb-1">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isTeacher ? 'Panel Docente & Administración' : 'Panel Oficial del Estudiante'}</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-white">
                  {isTeacher ? `Bienvenido, Prof. ${currentUser.name}` : 'Mi Aprendizaje'}
                </h1>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {currentUser.email} • TusCursosInmobiliarios Campus
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {isTeacher ? (
                <button
                  onClick={onOpenCreator}
                  className="px-5 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-violet-600/30 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>+ Crear Nuevo Curso</span>
                </button>
              ) : (
                <button
                  onClick={onExploreCatalog}
                  className="px-5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 text-xs sm:text-sm font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95 cursor-pointer"
                >
                  <BookOpen className="w-4 h-4 text-violet-600" />
                  <span>Explorar Catálogo</span>
                </button>
              )}
            </div>
          </div>

          {/* KPI Statistics Bar estilo Udemy */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
            <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                {isTeacher ? 'Cursos Publicados' : 'Cursos Matriculados'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-white mt-1 block">
                {isTeacher ? teacherCourses.length : enrolledCourses.length}
              </span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                {isTeacher ? 'Alumnos Activos' : 'En Progreso'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-violet-400 mt-1 block">
                {isTeacher ? 'Campus Abierto' : inProgressCourses.length}
              </span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Cursos Completados
              </span>
              <span className="text-xl sm:text-2xl font-black text-emerald-400 mt-1 block">
                {completedCourses.length}
              </span>
            </div>

            <div className="bg-slate-800/60 backdrop-blur-xs p-3.5 sm:p-4 rounded-2xl border border-slate-700/60">
              <span className="text-[11px] font-semibold text-slate-400 block uppercase tracking-wider">
                Certificados con QR
              </span>
              <span className="text-xl sm:text-2xl font-black text-amber-400 mt-1 block">
                {completedCourses.length}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        {/* TEACHER DASHBOARD VIEW */}
        {isTeacher ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <Users className="w-5 h-5 text-violet-600" />
                  <span>Cursos que has Creado y Administras</span>
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Supervisa tus temarios, lecciones con IA y precios oficiales.
                </p>
              </div>

              <button
                onClick={onOpenCreator}
                className="text-xs text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer"
              >
                + Crear otro curso
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teacherCourses.map((c) => (
                <div
                  key={c.id}
                  className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col justify-between group"
                >
                  <div className="relative aspect-video w-full overflow-hidden bg-slate-950">
                    <img 
                      src={getCourseThumbnail(c)} 
                      alt={c.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                    <div className="absolute top-3 left-3">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-violet-300 backdrop-blur-xs border border-violet-500/30">
                        {c.level}
                      </span>
                    </div>
                    <div className="absolute top-3 right-3">
                      <span className="text-xs font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-full shadow-md">
                        {c.price ? `$${c.price} USD` : 'Gratuito'}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block mb-1">
                        {c.category || 'Inmobiliario'}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                        {c.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {c.subtitle}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => onSelectCourse(c)}
                        className="w-full py-2.5 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-violet-600 hover:text-white text-slate-700 dark:text-slate-200 text-xs font-bold transition-all text-center cursor-pointer"
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
          /* STUDENT DASHBOARD VIEW (UDEMY STYLE) */
          <div className="space-y-6">
            
            {/* Active Student Special Offer */}
            <div className="p-5 sm:p-6 rounded-3xl bg-linear-to-r from-violet-900 via-indigo-900 to-slate-900 text-white border border-violet-500/30 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Tag className="w-4 h-4" />
                  <span>Beneficio Exclusivo del Alumno</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold">
                  Bono de Formación: Descuento del 50% en tu Siguiente Curso
                </h3>
                <p className="text-xs text-slate-300 max-w-xl">
                  Por pertenecer al campus oficial, accede a cualquier certificación adicional con precio bonificado. Usa el cupón <strong>CAMPUS2026</strong>.
                </p>
              </div>
              <button
                onClick={onExploreCatalog}
                className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shrink-0 cursor-pointer transition-transform active:scale-95"
              >
                Ver Cursos Disponibles
              </button>
            </div>

            {/* Udemy-style Tabs Bar & Internal Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-200 dark:border-slate-800">
              
              {/* Tab Pills */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setStudentTab('all')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    studentTab === 'all'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Todos los cursos ({enrolledCourses.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStudentTab('in-progress')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    studentTab === 'in-progress'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  En curso ({inProgressCourses.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStudentTab('completed')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap ${
                    studentTab === 'completed'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Completados ({completedCourses.length})
                </button>

                <button
                  type="button"
                  onClick={() => setStudentTab('certificates')}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    studentTab === 'certificates'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-amber-500" />
                  <span>Certificados ({completedCourses.length})</span>
                </button>
              </div>

              {/* Search within My Courses */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar en mis cursos..."
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>

            </div>

            {/* Courses List Grid (Udemy Cards) */}
            {displayedCourses.length === 0 ? (
              <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {enrolledCourses.length === 0
                    ? 'Aún no estás matriculado en ningún curso'
                    : 'No encontramos cursos con ese filtro'}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                  Accede a los cursos inmobiliarios certificados y comienza tu formación práctica hoy mismo.
                </p>
                <button
                  type="button"
                  onClick={onExploreCatalog}
                  className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-violet-500/25 cursor-pointer transition-transform active:scale-95"
                >
                  Explorar Catálogo de Cursos
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {displayedCourses.map((c) => {
                  const percent = getCoursePercent(c);
                  const totalLessons = c.units.reduce((acc, u) => acc + u.lessons.length, 0);
                  const completedLessons = getCourseCompletedLessons(c);
                  const isCompleted = percent === 100;

                  return (
                    <div
                      key={c.id}
                      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs hover:shadow-xl hover:border-violet-300 dark:hover:border-violet-700 transition-all flex flex-col justify-between group"
                    >
                      {/* Image Thumbnail with Overlay */}
                      <div 
                        className="relative aspect-video w-full overflow-hidden bg-slate-950 cursor-pointer"
                        onClick={() => onSelectCourse(c)}
                      >
                        <img 
                          src={getCourseThumbnail(c)} 
                          alt={c.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        
                        {/* Play Hover Overlay */}
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full bg-white text-violet-600 flex items-center justify-center shadow-xl">
                            <Play className="w-5 h-5 fill-violet-600 text-violet-600 ml-0.5" />
                          </div>
                        </div>

                        {/* Top Category Badge */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 text-violet-300 backdrop-blur-xs border border-violet-500/30">
                            {c.category || 'Inmobiliario'}
                          </span>
                        </div>

                        {/* Completion Badge */}
                        {isCompleted && (
                          <div className="absolute top-3 right-3">
                            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-600 text-white shadow-md flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>Completado</span>
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Card Content Body */}
                      <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                        <div className="space-y-1.5">
                          <h3 
                            className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-violet-600 dark:hover:text-violet-400 transition-colors"
                            onClick={() => onSelectCourse(c)}
                          >
                            {c.title}
                          </h3>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Academia TusCursosInmobiliarios
                          </p>
                        </div>

                        {/* Udemy-style Progress Section */}
                        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-500 dark:text-slate-400 font-medium">
                              {completedLessons} de {totalLessons} lecciones
                            </span>
                            <span className="font-black text-slate-900 dark:text-white">
                              {percent}%
                            </span>
                          </div>

                          {/* Progress bar line */}
                          <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                            <div 
                              className={`h-full rounded-full transition-all duration-300 ${
                                isCompleted
                                  ? 'bg-emerald-500'
                                  : 'bg-violet-600'
                              }`}
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>

                        {/* Action CTA Button */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => onSelectCourse(c)}
                            className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                              isCompleted
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 hover:bg-emerald-100'
                                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-violet-500/20'
                            }`}
                          >
                            {isCompleted ? (
                              <>
                                <Award className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                                <span>Ver Certificado y Repasar</span>
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 fill-white" />
                                <span>Continuar Curso</span>
                              </>
                            )}
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Recommended Next Courses Section */}
            {recommendedCourses.length > 0 && (
              <div className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                      Cursos Recomendados para Seguir Creciendo
                    </h2>
                    <p className="text-xs text-slate-500">
                      Continúa ampliando tus competencias inmobiliarias con estos programas oficiales.
                    </p>
                  </div>
                  <button
                    onClick={onExploreCatalog}
                    className="text-xs text-violet-600 dark:text-violet-400 font-bold hover:underline cursor-pointer"
                  >
                    Ver catálogo completo →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {recommendedCourses.map((rc) => (
                    <div 
                      key={rc.id}
                      onClick={() => onSelectCourse(rc)}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-violet-400 transition-all cursor-pointer flex gap-3.5 items-center group"
                    >
                      <img 
                        src={getCourseThumbnail(rc)} 
                        alt={rc.title} 
                        className="w-20 h-16 rounded-xl object-cover shrink-0" 
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold text-violet-600 uppercase tracking-wider block">
                          {rc.category || 'Especialización'}
                        </span>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-violet-600 transition-colors">
                          {rc.title}
                        </h4>
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 block">
                          {rc.price ? `$${rc.price} USD` : 'Gratis'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

      </div>

    </div>
  );
};
