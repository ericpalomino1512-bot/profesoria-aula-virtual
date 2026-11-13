import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Video
} from 'lucide-react';
import type { Lesson, VideoSlide } from '../types/course';
import { buildLessonVideoData } from '../services/materialGenerator';

interface LessonVideoPlayerProps {
  lesson: Lesson;
  unitTitle: string;
}

export const LessonVideoPlayer: React.FC<LessonVideoPlayerProps> = ({ lesson, unitTitle }) => {
  const videoData = lesson.video || buildLessonVideoData(lesson, unitTitle);
  const slides = videoData.slides;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [progressPercent, setProgressPercent] = useState(0);
  const [activeTab, setActiveTab] = useState<'ai-video' | 'custom-url'>('ai-video');
  const [customUrl, setCustomUrl] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`profesoria_lesson_video_${lesson.id}`);
      if (saved) return saved;
    }
    return videoData.customEmbedUrl || '';
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`profesoria_lesson_video_${lesson.id}`);
      if (saved) {
        setCustomUrl(saved);
        setActiveTab('custom-url');
      } else {
        setCustomUrl(videoData.customEmbedUrl || '');
        setActiveTab('ai-video');
      }
    }
  }, [lesson.id]);

  const handleUpdateCustomUrl = (val: string) => {
    setCustomUrl(val);
    if (typeof window !== 'undefined') {
      if (val.trim()) {
        localStorage.setItem(`profesoria_lesson_video_${lesson.id}`, val.trim());
      } else {
        localStorage.removeItem(`profesoria_lesson_video_${lesson.id}`);
      }
    }
  };

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

  // When lesson changes, reset
  useEffect(() => {
    stopSpeech();
    setCurrentSlideIndex(0);
    setIsPlaying(false);
    setProgressPercent(0);
  }, [lesson.id]);

  const stopSpeech = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current);
    }
  };

  const playSlideSpeech = (index: number) => {
    stopSpeech();

    const slide = slides[index];
    if (!slide) return;

    if (!isMuted && synthRef.current) {
      const utterance = new SpeechSynthesisUtterance(slide.narrationText);
      utterance.lang = 'es-ES';
      utterance.rate = playbackRate;

      // Select Spanish voice if available
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

    // Slide progress simulation
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

  const currentSlide: VideoSlide = slides[currentSlideIndex] || slides[0];

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-purple-100 dark:border-slate-800 shadow-sm p-6 sm:p-7 transition-all space-y-4">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-violet-600 text-white flex items-center justify-center shadow-md shadow-violet-500/20 shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400">
                Video de la Lección
              </span>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                activeTab === 'ai-video'
                  ? 'bg-violet-100 text-violet-800 dark:bg-violet-950/60 dark:text-violet-300'
                  : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
              }`}>
                {activeTab === 'ai-video' ? 'Generado con IA' : 'Video del Profesor'}
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
              {lesson.lessonNumber}. {lesson.title}
            </h3>
          </div>
        </div>

        {/* Tab switch: AI Video vs Custom Embed */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 text-xs shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('ai-video')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'ai-video'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Video con IA (Generado)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('custom-url')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
              activeTab === 'custom-url'
                ? 'bg-white dark:bg-slate-900 text-violet-600 dark:text-violet-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Video del Profesor (Vincular)
          </button>
        </div>
      </div>

      {activeTab === 'ai-video' ? (
        <>
          {/* Main 16:9 Video Canvas Screen */}
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-950 text-white shadow-xl flex flex-col justify-between border border-slate-800 group">
            
            {/* Top Bar inside player */}
            <div className="p-4 sm:p-5 flex items-center justify-between z-10 bg-gradient-to-b from-black/80 to-transparent">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-violet-600/90 text-white backdrop-blur-md">
                  {currentSlide.badge}
                </span>
                <span className="text-xs text-slate-300 hidden sm:inline">
                  {unitTitle}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-400">
                Capítulo {currentSlideIndex + 1} de {slides.length}
              </span>
            </div>

            {/* Center Visual Slide Content */}
            <div className="px-6 sm:px-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto my-auto z-10 animate-in fade-in zoom-in-95 duration-300">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/20 border border-violet-500/40 text-violet-300 flex items-center justify-center mb-4 backdrop-blur-md">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>

              <h4 className="text-lg sm:text-2xl font-black text-white tracking-tight leading-snug">
                {currentSlide.title}
              </h4>
              <p className="text-xs sm:text-sm text-violet-200 mt-1 font-medium">
                {currentSlide.subtitle}
              </p>

              {/* Slide bullet points */}
              <div className="mt-5 space-y-2 text-left w-full max-w-lg bg-black/40 backdrop-blur-md p-4 rounded-xl border border-white/10">
                {currentSlide.bullets.map((bullet, bIdx) => (
                  <div key={bIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{bullet}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Subtitles & Control Bar */}
            <div className="p-4 sm:p-5 z-10 bg-gradient-to-t from-black/90 via-black/60 to-transparent space-y-3">
              
              {/* Dynamic Subtitles in Spanish */}
              <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-center border border-white/10">
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
                
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={togglePlay}
                    className="w-9 h-9 rounded-full bg-violet-600 hover:bg-violet-500 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md shadow-violet-600/30"
                    title={isPlaying ? 'Pausar' : 'Reproducir video con voz IA'}
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>

                  <button
                    type="button"
                    onClick={handleRestart}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                    title="Reiniciar video desde el inicio"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleMute}
                    className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10"
                    title={isMuted ? 'Activar voz en español' : 'Silenciar voz'}
                  >
                    {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
                  </button>

                  {/* Playback rate */}
                  <select
                    value={playbackRate}
                    onChange={(e) => setPlaybackRate(parseFloat(e.target.value))}
                    className="bg-black/40 text-slate-200 border border-white/10 rounded-lg px-2 py-1 text-xs focus:outline-none"
                  >
                    <option value={1}>1.0x</option>
                    <option value={1.25}>1.25x</option>
                    <option value={1.5}>1.5x</option>
                  </select>
                </div>

                {/* Chapter pills */}
                <div className="hidden md:flex items-center gap-1.5">
                  {slides.map((s, idx) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleSelectSlide(idx)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                        currentSlideIndex === idx
                          ? 'bg-violet-600 text-white'
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

          {/* Chapter descriptions under video */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
            {slides.map((slide, sIdx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => handleSelectSlide(sIdx)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  currentSlideIndex === sIdx
                    ? 'border-violet-500 bg-violet-50/70 dark:bg-violet-950/40 ring-1 ring-violet-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-violet-600 dark:text-violet-400 block">
                  Capítulo {sIdx + 1}
                </span>
                <strong className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1 block mt-0.5">
                  {slide.title}
                </strong>
              </button>
            ))}
          </div>
        </>
      ) : (
        /* Custom Embed URL Tab */
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-200 mb-1.5">
              Enlace o Embed de Video Externo (YouTube, Loom, Google Drive, MP4):
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={customUrl}
                onChange={(e) => handleUpdateCustomUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=... o enlace de Vimeo / Loom / Drive"
                className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
              Como profesor puedes vincular tu propio video grabado (YouTube, Vimeo, Loom o Google Drive) para esta lección específica, o volver a la pestaña de Video con IA en cualquier momento.
            </p>
          </div>

          {customUrl && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-md border border-slate-700">
              {customUrl.includes('youtube.com') || customUrl.includes('youtu.be') ? (
                <iframe
                  src={customUrl.replace('watch?v=', 'embed/').replace('youtu.be/', 'youtube.com/embed/')}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video externo"
                />
              ) : (
                <iframe
                  src={customUrl}
                  className="w-full h-full"
                  allowFullScreen
                  title="Video externo"
                />
              )}
            </div>
          )}
        </div>
      )}

    </div>
  );
};
