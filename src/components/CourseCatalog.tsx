import React, { useState } from 'react';
import type { Course } from '../types/course';
import { 
  BookOpen, 
  Clock, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  ExternalLink, 
  Search,
  Lock,
  Layers,
  Heart
} from 'lucide-react';

interface CourseCatalogProps {
  courses: Course[];
  enrolledCourseIds: string[];
  wishlistCourseIds?: string[];
  onToggleWishlist?: (courseId: string) => void;
  onSelectCourse: (course: Course, startLessonId?: string) => void;
  onEnrollCourse: (course: Course) => void;
  onOpenCreator?: () => void;
}

export const CourseCatalog: React.FC<CourseCatalogProps> = ({
  courses,
  enrolledCourseIds,
  wishlistCourseIds = [],
  onToggleWishlist,
  onSelectCourse,
  onEnrollCourse,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');

  const categories = ['todos', ...Array.from(new Set(courses.map(c => c.category || 'General')))];

  const filteredCourses = courses.filter(course => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.targetProfile.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = 
      selectedCategory === 'todos' || 
      (course.category || 'General') === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10 animate-in fade-in duration-300">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-violet-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-2xl border border-violet-500/20">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 bg-violet-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/30 border border-violet-400/40 text-xs font-semibold tracking-wide text-violet-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Campus Virtual & Academia Inmobiliaria</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
            Domina el sector inmobiliario con itinerarios interactivos y videos con IA
          </h1>
          <p className="text-sm sm:text-base text-violet-100/90 leading-relaxed max-w-2xl">
            Aprende a tu propio ritmo con lecciones sintetizadas, casos prácticos reales, cuestionarios pedagógicos y materiales de apoyo descargables en Excel y PDF.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <a 
              href="https://tuscursosinmobiliarios.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs sm:text-sm font-semibold text-white border border-white/20 backdrop-blur-xs transition-colors"
            >
              <span>← Volver a TusCursosInmobiliarios.com</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </a>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Buscar por tema, habilidad o perfil..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-violet-500 shadow-xs"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Course Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredCourses.map((course) => {
          const isEnrolled = enrolledCourseIds.includes(course.id);
          const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);

          return (
            <div 
              key={course.id}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/90 dark:border-slate-800/90 hover:border-violet-300 dark:hover:border-violet-800/80 shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden"
            >
              {/* Card Header Badge */}
              <div className="p-6 pb-4 flex items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800/60 bg-slate-50/60 dark:bg-slate-800/30">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-violet-100 dark:bg-violet-950/70 text-violet-700 dark:text-violet-300">
                  <Award className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
                  {course.level}
                </span>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    {course.price && course.price > 0 ? (
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ${course.price} {course.currency || 'USD'}
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Gratuito
                      </span>
                    )}
                  </div>

                  {onToggleWishlist && (
                    <button
                      type="button"
                      onClick={() => onToggleWishlist(course.id)}
                      className={`p-1.5 rounded-xl border transition-all ${
                        wishlistCourseIds.includes(course.id)
                          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900 dark:text-rose-400'
                          : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:text-rose-500 hover:border-rose-200'
                      }`}
                      title={wishlistCourseIds.includes(course.id) ? 'Quitar de mis favoritos' : 'Me gusta / Guardar en favoritos'}
                    >
                      <Heart className={`w-4 h-4 ${wishlistCourseIds.includes(course.id) ? 'fill-rose-500' : ''}`} />
                    </button>
                  )}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {course.subtitle}
                  </p>
                </div>

                {/* Course Metadata Chips */}
                <div className="pt-2 space-y-2 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{course.estimatedDuration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>{course.units.length} módulos • {totalLessons} lecciones estructuradas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">Para: {course.targetProfile}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex items-center gap-2.5">
                  {isEnrolled ? (
                    <button
                      onClick={() => onSelectCourse(course)}
                      className="w-full py-2.5 px-4 rounded-xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-violet-500/20 transition-transform active:scale-95"
                    >
                      <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      <span>Ir al Curso (Inscrito)</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <>
                      <button
                        onClick={() => onSelectCourse(course)}
                        className="flex-1 py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>Vista previa</span>
                      </button>

                      <button
                        onClick={() => onEnrollCourse(course)}
                        className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-95"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>Inscribirme</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
