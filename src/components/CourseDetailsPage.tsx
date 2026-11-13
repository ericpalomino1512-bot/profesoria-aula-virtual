import React, { useState } from 'react';
import type { Course, StudentUser } from '../types/course';
import { getCourseThumbnail } from '../utils/courseImages';
import { LessonVideoPlayer } from './LessonVideoPlayer';
import { 
  Star, 
  Clock, 
  Globe, 
  Award, 
  CheckCircle2, 
  Play, 
  Lock, 
  Heart, 
  ArrowLeft, 
  Layers, 
  ChevronDown, 
  ChevronUp, 
  FileSpreadsheet, 
  AlertCircle,
  Sparkles,
  X
} from 'lucide-react';

interface CourseDetailsPageProps {
  course: Course;
  isEnrolled: boolean;
  currentUser: StudentUser | null;
  isWishlisted: boolean;
  onToggleWishlist: (courseId: string) => void;
  onEnroll: (course: Course) => void;
  onStartCourse: (course: Course, startLessonId?: string) => void;
  onBackToCatalog: () => void;
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  onOpenCheckout?: (course: Course) => void;
}

export const CourseDetailsPage: React.FC<CourseDetailsPageProps> = ({
  course,
  isEnrolled,
  currentUser,
  isWishlisted,
  onToggleWishlist,
  onEnroll,
  onStartCourse,
  onBackToCatalog,
  onOpenAuthModal,
  onOpenCheckout,
}) => {
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>(() => {
    // Expand first unit by default
    const map: Record<string, boolean> = {};
    course.units.forEach((u, i) => {
      map[u.id] = i === 0;
    });
    return map;
  });

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [enrollWarning, setEnrollWarning] = useState<string | null>(null);

  const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);
  const isPaid = Boolean(course.price && course.price > 0);

  const toggleUnit = (unitId: string) => {
    setExpandedUnits(prev => ({
      ...prev,
      [unitId]: !prev[unitId]
    }));
  };

  const handleEnrollClick = () => {
    if (isEnrolled) {
      onStartCourse(course);
      return;
    }

    if (!currentUser) {
      setEnrollWarning('Para inscribirte y guardar tu progreso en este curso, primero inicia sesión o crea tu cuenta de alumno gratuita.');
      onOpenAuthModal('login');
      return;
    }

    if (isPaid) {
      if (onOpenCheckout) {
        onOpenCheckout(course);
        return;
      }
    }

    onEnroll(course);
  };

  const handlePreviewLesson = (lessonId: string) => {
    onStartCourse(course, lessonId);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 pb-16 animate-in fade-in duration-300">
      
      {/* Top Breadcrumb & Back bar */}
      <div className="bg-slate-900 border-b border-slate-800 text-slate-400 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={onBackToCatalog}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </button>
          
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span>Catálogo</span>
            <span>/</span>
            <span>{course.category || 'Inmobiliario'}</span>
            <span>/</span>
            <span className="text-slate-200 truncate max-w-xs">{course.title}</span>
          </div>
        </div>
      </div>

      {/* Hero Section (Udemy dark theme) */}
      <section className="bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Hero Content */}
            <div className="lg:col-span-8 space-y-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-violet-600/30 text-violet-300 border border-violet-500/40">
                  {course.level}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                  {course.category || 'Especialización Inmobiliaria'}
                </span>
                {isEnrolled && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Ya estás matriculado</span>
                  </span>
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
                {course.title}
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
                {course.subtitle}
              </p>

              {/* Rating & stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm pt-2 text-slate-300">
                <div className="flex items-center gap-1 font-bold text-amber-400">
                  <span>4.9</span>
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-slate-400 text-xs font-normal underline ml-1">(120 calificaciones)</span>
                </div>

                <div className="text-slate-400">
                  <span>+450 alumnos inscritos</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Globe className="w-3.5 h-3.5 text-slate-400" />
                  <span>Español</span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{course.estimatedDuration}</span>
                </div>
              </div>

              <div className="pt-2 text-xs text-slate-400 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-violet-400" />
                <span>Programa certificado por el Campus Virtual de <strong>TusCursosInmobiliarios</strong></span>
              </div>
            </div>

            {/* Right Card (Mobile will render inline, desktop sticky) */}
            <div className="lg:col-span-4 lg:sticky lg:top-20">
              <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden text-slate-900 dark:text-white">
                
                {/* Course Thumbnail Image with Preview Overlay */}
                <div className="relative aspect-video w-full bg-slate-950 overflow-hidden group">
                  <img 
                    src={getCourseThumbnail(course)} 
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-slate-950/40 group-hover:bg-slate-950/20 transition-colors flex flex-col items-center justify-center p-4">
                    <button
                      type="button"
                      onClick={() => setIsPreviewModalOpen(true)}
                      className="w-14 h-14 rounded-full bg-white hover:bg-violet-50 text-violet-600 flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform cursor-pointer"
                      title="Ver video de bienvenida y presentación"
                    >
                      <Play className="w-6 h-6 fill-violet-600 text-violet-600 ml-1" />
                    </button>
                    <span className="mt-2 text-xs font-bold text-white drop-shadow-md">
                      Vista previa del curso
                    </span>
                  </div>
                </div>

                {/* Pricing & CTA Body */}
                <div className="p-6 space-y-5">
                  <div className="flex items-baseline justify-between">
                    <div>
                      {isPaid ? (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-slate-900 dark:text-white">
                            ${course.price} {course.currency || 'USD'}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ${(course.price! * 1.5).toFixed(0)} USD
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-2">
                          <span className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
                            Gratuito
                          </span>
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                            100% Bonificado
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Warning if login is needed */}
                  {enrollWarning && (
                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>{enrollWarning}</span>
                    </div>
                  )}

                  {/* Main Action Button */}
                  <div className="space-y-2">
                    {isEnrolled ? (
                      <button
                        onClick={() => onStartCourse(course)}
                        className="w-full py-3.5 px-4 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25 transition-transform active:scale-95 cursor-pointer"
                      >
                        <Play className="w-4 h-4 fill-white" />
                        <span>Ir al Aula Virtual / Continuar</span>
                      </button>
                    ) : (
                      <button
                        onClick={handleEnrollClick}
                        className={`w-full py-3.5 px-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95 cursor-pointer ${
                          isPaid
                            ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                            : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25'
                        }`}
                      >
                        {isPaid ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                        <span>{isPaid ? 'Comprar e Inscribirme Ahora' : 'Inscribirme Ahora (Gratis)'}</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => onToggleWishlist(course.id)}
                      className={`w-full py-2.5 px-4 rounded-2xl border text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                        isWishlisted
                          ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/40 dark:border-rose-900 dark:text-rose-400'
                          : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{isWishlisted ? 'Guardado en Mis Cursos (Me gusta)' : 'Guardar en mi lista de deseos'}</span>
                    </button>
                  </div>

                  <p className="text-[11px] text-center text-slate-400">
                    Garantía de acceso completo • Formación continua
                  </p>

                  {/* Course Includes List */}
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                    <span className="font-bold text-slate-900 dark:text-white block mb-1">
                      Este curso incluye:
                    </span>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>{course.estimatedDuration} de estudio a tu ritmo</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Layers className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>{course.units.length} módulos y {totalLessons} lecciones interactivas</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <FileSpreadsheet className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>Plantillas descargables en Excel y Guías PDF</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>Acceso de por vida en móvil y computadora</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Award className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0" />
                      <span>Certificado de finalización al aprobar</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Main Page Body (What you'll learn + Curriculum) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          <div className="lg:col-span-8 space-y-10">
            
            {/* Box: Lo que aprenderás (Udemy style box) */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-4 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Lo que aprenderás
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {course.learningObjectives.map((obj, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{obj}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contenido del curso (Curriculum Accordion) */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    Contenido del curso
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {course.units.length} módulos • {totalLessons} lecciones • {course.estimatedDuration} de duración total
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const allExpanded = Object.values(expandedUnits).every(Boolean);
                    const updated: Record<string, boolean> = {};
                    course.units.forEach(u => {
                      updated[u.id] = !allExpanded;
                    });
                    setExpandedUnits(updated);
                  }}
                  className="text-xs font-bold text-violet-600 dark:text-violet-400 hover:underline text-left"
                >
                  {Object.values(expandedUnits).every(Boolean) ? 'Contraer todas las secciones' : 'Expandir todas las secciones'}
                </button>
              </div>

              {/* Accordion Units */}
              <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 bg-white dark:bg-slate-900">
                {course.units.map((unit, unitIdx) => {
                  const isOpen = Boolean(expandedUnits[unit.id]);

                  return (
                    <div key={unit.id} className="transition-colors">
                      {/* Accordion Header */}
                      <button
                        type="button"
                        onClick={() => toggleUnit(unit.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between gap-4 text-left bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/80 dark:hover:bg-slate-800/70 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isOpen ? (
                            <ChevronUp className="w-4 h-4 text-slate-500 shrink-0" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />
                          )}
                          <div>
                            <span className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider block">
                              Módulo {unit.unitNumber}
                            </span>
                            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                              {unit.title}
                            </h3>
                          </div>
                        </div>

                        <span className="text-xs text-slate-500 font-medium shrink-0">
                          {unit.lessons.length} lecciones
                        </span>
                      </button>

                      {/* Accordion Content */}
                      {isOpen && (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                          {unit.lessons.map((lesson, lessonIdx) => {
                            // First lesson of course is free preview
                            const isFreePreview = unitIdx === 0 && lessonIdx === 0;
                            const isLocked = !isEnrolled && !isFreePreview;

                            return (
                              <div
                                key={lesson.id}
                                className="p-3.5 sm:p-4 flex items-center justify-between gap-4 text-xs sm:text-sm hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  {isLocked ? (
                                    <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                  ) : (
                                    <Play className="w-3.5 h-3.5 fill-violet-600 text-violet-600 shrink-0" />
                                  )}
                                  
                                  <div className="min-w-0">
                                    <span className="font-medium text-slate-800 dark:text-slate-200 block truncate">
                                      {lesson.lessonNumber}. {lesson.title}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center gap-3 shrink-0">
                                  {isFreePreview && !isEnrolled && (
                                    <button
                                      onClick={() => handlePreviewLesson(lesson.id)}
                                      className="px-2.5 py-1 rounded-lg bg-violet-100 dark:bg-violet-950/60 text-violet-700 dark:text-violet-300 font-bold text-xs hover:bg-violet-200 transition-colors cursor-pointer"
                                    >
                                      Vista previa
                                    </button>
                                  )}

                                  {isLocked && (
                                    <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                                      <Lock className="w-3 h-3" />
                                      <span>Bloqueado</span>
                                    </span>
                                  )}

                                  <span className="text-xs text-slate-400">
                                    {lesson.durationMinutes} min
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Requisitos */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-3 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Requisitos
              </h2>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <li>Conexión a internet estable desde cualquier teléfono móvil, tablet o computadora.</li>
                <li>Ganas de profesionalizar tus procesos en el sector inmobiliario y de ventas.</li>
                <li>No se requiere experiencia previa en programación ni herramientas complejas.</li>
              </ul>
            </div>

            {/* ¿Para quién es este curso? */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-3 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                ¿Para quién es este curso?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Este programa ha sido diseñado especialmente para <strong>{course.targetProfile}</strong> con el objetivo fundamental de: <em>"{course.mainGoal}"</em>.
              </p>
            </div>

            {/* Certificación y Proyecto Final */}
            <div className="bg-linear-to-r from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 rounded-3xl border border-violet-200 dark:border-violet-900/50 p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2 text-violet-700 dark:text-violet-300 font-bold text-sm">
                <Award className="w-5 h-5" />
                <span>Certificado Oficial del Campus</span>
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Acredita tus competencias profesionales
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Al completar todas las lecciones interactivas, superar los cuestionarios pedagógicos y el proyecto final de este curso, recibirás un certificado descargable con tu nombre y código de validación expedido por TusCursosInmobiliarios.
              </p>
            </div>

          </div>

          {/* Right sidebar column placeholder for desktop alignment */}
          <div className="hidden lg:block lg:col-span-4" />

        </div>
      </div>

      {/* Course Welcome Video Preview Modal (Udemy style preview) */}
      {isPreviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden space-y-4">
            
            {/* Modal Header */}
            <div className="p-5 pb-3 flex items-center justify-between border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
                  <Play className="w-4 h-4 fill-violet-600 text-violet-600" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white line-clamp-1">
                    Vista previa del curso: {course.title}
                  </h3>
                  <span className="text-xs text-slate-500">Video explicativo con IA y presentación del programa</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Video Player with AI Presentation Slides */}
            <div className="px-5">
              {course.units[0]?.lessons[0] && (
                <LessonVideoPlayer
                  lesson={course.units[0].lessons[0]}
                  unitTitle={course.units[0].title}
                />
              )}
            </div>

            {/* Modal Footer Call To Action */}
            <div className="p-5 pt-3 bg-slate-50/80 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 block">Acceso completo al aula y certificado:</span>
                <span className="text-xl font-black text-slate-900 dark:text-white">
                  {isPaid ? `$${course.price} ${course.currency || 'USD'}` : 'Gratuito (100% Bonificado)'}
                </span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setIsPreviewModalOpen(false);
                    handleEnrollClick();
                  }}
                  className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                    isPaid
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25'
                      : 'bg-violet-600 hover:bg-violet-700 text-white shadow-violet-500/25'
                  }`}
                >
                  {isPaid ? <Lock className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                  <span>{isPaid ? `Comprar e Inscribirme Ahora ($${course.price} USD)` : 'Inscribirme Ahora (Gratis)'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
