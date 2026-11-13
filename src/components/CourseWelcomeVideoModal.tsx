import React, { useState, useEffect, useRef } from 'react';
import type { Course } from '../types/course';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Lock, 
  Video
} from 'lucide-react';

interface CourseWelcomeVideoModalProps {
  isOpen: boolean;
  course: Course;
  isPaid: boolean;
  onClose: () => void;
  onEnroll: () => void;
}

interface WelcomeSlide {
  id: string;
  badge: string;
  chapterNumber: number;
  chapterName: string;
  title: string;
  subtitle: string;
  bullets: string[];
  narrationText: string;
  durationSeconds: number;
}

export const CourseWelcomeVideoModal: React.FC<CourseWelcomeVideoModalProps> = ({
  isOpen,
  course,
  isPaid,
  onClose,
  onEnroll,
}) => {
  const totalLessons = course.units.reduce((acc, u) => acc + u.lessons.length, 0);

  // Slides specifically focused on Course Welcome and "Qué vas a aprender"
  const slides: WelcomeSlide[] = [
    {
      id: 'welcome-slide-1',
      badge: 'PRESENTACIÓN OFICIAL',
      chapterNumber: 1,
      chapterName: 'Bienvenida al Curso',
      title: `Bienvenida a: ${course.title}`,
      subtitle: `Programa Oficial • ${course.category || 'Especialización Inmobiliaria'}`,
      bullets: [
        `Dirigido a: ${course.targetProfile || 'Profesionales y emprendedores del sector inmobiliario'}`,
        `Nivel: ${course.level || 'Intermedio'} • ${course.estimatedDuration || 'A tu propio ritmo'}`,
        'Acceso continuo a contenidos actualizados y recursos complementarios'
      ],
      narrationText: `¡Te damos la más cordial bienvenida al curso ${course.title}! Este programa ha sido preparado para que adquieras competencias prácticas de alto impacto en tu carrera profesional.`,
      durationSeconds: 10
    },
    {
      id: 'welcome-slide-2',
      badge: '¿QUÉ VAS A APRENDER?',
      chapterNumber: 2,
      chapterName: 'Qué vas a aprender',
      title: '¿Qué vas a aprender en este programa?',
      subtitle: 'Objetivo pedagógico y competencias que dominarás',
      bullets: [
        course.mainGoal || 'Dominarás las estrategias y técnicas fundamentales aplicadas a casos reales',
        'Metodología práctica con enfoque directo al mercado inmobiliario y comercial',
        'Cuestionarios interactivos y ejercicios de autoevaluación para afianzar cada concepto'
      ],
      narrationText: `En este curso vas a aprender a ${course.mainGoal || 'dominar las mejores herramientas y técnicas prácticas del sector'}. Aprenderás paso a paso con ejemplos directos aplicables a tus operaciones cotidianas.`,
      durationSeconds: 12
    },
    {
      id: 'welcome-slide-3',
      badge: 'TEMARIO Y CONTENIDOS',
      chapterNumber: 3,
      chapterName: 'Ruta de Aprendizaje',
      title: 'Estructura del Programa y Módulos',
      subtitle: `${course.units.length} Módulos temáticos estructurados con ${totalLessons} lecciones`,
      bullets: [
        `Módulo 1: ${course.units[0]?.title || 'Fundamentos y Conceptos Clave'}`,
        course.units[1] ? `Módulo 2: ${course.units[1].title}` : 'Metodologías y Casos Prácticos',
        course.units[2] ? `Módulo 3: ${course.units[2].title}` : 'Evaluaciones Formativas y Proyecto Final Integrador',
        'Documentos, resúmenes y plantillas de trabajo descargables'
      ],
      narrationText: `El contenido está distribuido en ${course.units.length} módulos didácticos consecutivos, permitiéndote progresar desde los conceptos esenciales hasta la resolución práctica de escenarios avanzados.`,
      durationSeconds: 11
    },
    {
      id: 'welcome-slide-4',
      badge: 'CERTIFICACIÓN Y ACCESO',
      chapterNumber: 4,
      chapterName: 'Certificación y Acceso',
      title: 'Certifícate y Comienza Hoy Mismo',
      subtitle: 'Formación continua 100% online y a tu propio ritmo',
      bullets: [
        'Certificado Oficial de Finalización expedido por TusCursosInmobiliarios con código QR',
        'Estudia las 24 horas del día desde cualquier computadora, tablet o teléfono móvil',
        'Inscríbete ahora para desbloquear el temario completo de inmediato'
      ],
      narrationText: `Al completar todas las lecciones interactivas y tu evaluación final, recibirás tu Certificado Oficial acreditativo. ¡Inscríbete ahora y comienza tu formación de inmediato!`,
      durationSeconds: 10
    }
  ];

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);

  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const progressTimerRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }
    return () => {
      stopSpeech();
    };
  }, []);

  // Handle ESC key to close modal
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentSlideIndex(0);
      setProgressPercent(0);
      setIsPlaying(false);
    } else {
      stopSpeech();
    }
  }, [isOpen, course.id]);

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
  };

  const handleClose = () => {
    stopSpeech();
    onClose();
  };

  const playSlideSpeech = (index: number) => {
    stopSpeech();

    const slide = slides[index];
    if (!slide) return;

    if (!isMuted && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(slide.narrationText);
      utterance.lang = 'es-ES';
      utterance.rate = playbackRate;

      const voices = synthRef.current.getVoices();
      const spanishVoice = voices.find(v => v.lang.startsWith('es') || v.lang.includes('ES'));
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }

      utterance.onend = () => {
        if (index < slides.length - 1) {
          setCurrentSlideIndex(index + 1);
          playSlideSpeech(index + 1);
        } else {
          setIsPlaying(false);
          setProgressPercent(100);
        }
      };

      utterance.onerror = () => {
        setIsPlaying(false);
      };

      utteranceRef.current = utterance;
      synthRef.current.speak(utterance);
    }

    const durationMs = (slide.durationSeconds / playbackRate) * 1000;
    const intervalMs = 100;
    let elapsed = 0;

    progressTimerRef.current = setInterval(() => {
      elapsed += intervalMs;
      const pct = Math.min(100, Math.round((elapsed / durationMs) * 100));
      setProgressPercent(pct);

      if (elapsed >= durationMs && isMuted) {
        clearInterval(progressTimerRef.current);
        if (index < slides.length - 1) {
          setCurrentSlideIndex(index + 1);
          playSlideSpeech(index + 1);
        } else {
          setIsPlaying(false);
          setProgressPercent(100);
        }
      }
    }, intervalMs);
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playSlideSpeech(currentSlideIndex);
    }
  };

  const handleRestart = () => {
    stopSpeech();
    setCurrentSlideIndex(0);
    setProgressPercent(0);
    setIsPlaying(true);
    playSlideSpeech(0);
  };

  const handleSelectSlide = (idx: number) => {
    setCurrentSlideIndex(idx);
    setProgressPercent(0);
    if (isPlaying) {
      playSlideSpeech(idx);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (isPlaying) {
      playSlideSpeech(currentSlideIndex);
    }
  };

  if (!isOpen) return null;

  const currentSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={handleClose}
    >
      {/* Modal Dialog Window */}
      <div 
        className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Top Header with Clear Title and Close 'X' */}
        <div className="px-5 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/25">
              <Video className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white leading-tight">
                Video de bienvenida al curso
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                {course.title}
              </p>
            </div>
          </div>

          {/* Prominent Close X Button */}
          <button
            type="button"
            onClick={handleClose}
            className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer shadow-xs shrink-0"
            title="Cerrar video (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Canvas Area */}
        <div className="p-4 sm:p-6 space-y-4">
          
          {/* Main 16:9 Video Canvas Screen */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 text-white shadow-xl flex flex-col justify-between border border-slate-800 group">
            
            {/* Top Bar inside player */}
            <div className="p-3 sm:p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/85 via-black/40 to-transparent">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-600/90 text-white backdrop-blur-md">
                  {currentSlide.badge}
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline line-clamp-1 max-w-sm">
                  {course.title}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-300">
                  Capítulo {currentSlideIndex + 1} de {slides.length}
                </span>
                {/* Secondary inner X button for high visibility */}
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1 rounded-lg bg-black/40 hover:bg-black/70 text-slate-300 hover:text-white transition-colors cursor-pointer sm:hidden"
                  title="Cerrar video"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Center Visual Slide Content */}
            <div className="px-5 sm:px-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto z-10 animate-in fade-in zoom-in-95 duration-250">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-3 backdrop-blur-md shadow-lg shadow-violet-500/20">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <h3 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h3>
              <p className="text-xs sm:text-sm text-violet-200 mt-1 font-medium">
                {currentSlide.subtitle}
              </p>

              {/* Slide bullet points */}
              <div className="mt-4 sm:mt-5 space-y-2 text-left w-full max-w-lg bg-black/45 backdrop-blur-md p-3.5 sm:p-4 rounded-xl border border-white/10">
                {currentSlide.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Subtitles & Control Bar */}
            <div className="p-3 sm:p-4 z-10 bg-gradient-to-t from-black/95 via-black/75 to-transparent space-y-2.5">
              
              {/* Dynamic Subtitles in Spanish */}
              <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl text-center border border-white/10">
                <p className="text-xs sm:text-sm font-medium text-slate-200 line-clamp-2">
                  🎙️ {currentSlide.narrationText}
                </p>
              </div>

              {/* Timeline progress bar */}
              <div className="w-full h-1.5 rounded-full bg-white/20 overflow-hidden cursor-pointer">
                <div 
                  className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 transition-all duration-150"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between text-xs">
                
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md shadow-violet-600/30 cursor-pointer"
                    title={isPlaying ? 'Pausar' : 'Reproducir video de bienvenida'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    title="Reiniciar presentación desde el inicio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 cursor-pointer"
                    title={isMuted ? 'Activar narración de voz' : 'Silenciar narración'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Playback rate */}
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-black/50 text-slate-200 border border-white/15 rounded-lg px-2 py-1 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>

                {/* Chapter chips inside player for desktop */}
                <div className="hidden sm:flex items-center gap-1.5">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSlide(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer ${
                        currentSlideIndex === idx
                          ? 'bg-violet-600 text-white shadow-xs'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20'
                      }`}
                    >
                      Cap {idx + 1}
                    </button>
                  ))}
                </div>

              </div>

            </div>

          </div>

          {/* Chapter descriptions below video (Detalle de capítulos) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {slides.map((slide, sIdx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(sIdx)}
                className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer ${
                  currentSlideIndex === sIdx
                    ? 'border-violet-500 bg-violet-50/80 dark:bg-violet-950/50 ring-2 ring-violet-500/40'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                    Capítulo {sIdx + 1}
                  </span>
                  {currentSlideIndex === sIdx && (
                    <span className="w-2 h-2 rounded-full bg-violet-600 animate-ping" />
                  )}
                </div>
                <strong className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 block">
                  {slide.chapterName}
                </strong>
              </button>
            ))}
          </div>

        </div>

        {/* Modal Footer Call To Action */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block">
              Inscripción y acceso al aula virtual:
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {isPaid ? `$${course.price} ${course.currency || 'USD'}` : 'Gratuito (100% Bonificado)'}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                • Certificado incluido
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleClose}
              className="w-1/2 sm:w-auto px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Cerrar
            </button>

            <button
              type="button"
              onClick={() => {
                handleClose();
                onEnroll();
              }}
              className={`w-1/2 sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
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
  );
};
