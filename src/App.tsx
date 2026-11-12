import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CourseDesignHome } from './components/CourseDesignHome';
import { CourseView } from './components/CourseView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ShareCourseModal } from './components/ShareCourseModal';
import type { Course, CourseFormData } from './types/course';
import { generateCourseWithGemini, getStoredApiKey } from './services/geminiService';
import { buildCourseFromDocuments, buildCourseFromTopic } from './services/localCourseEngine';
import type { ParsedDocument } from './services/documentParser';
import { getSharedCourseFromUrl } from './utils/courseSharing';
import { DEMO_COURSE } from './services/demoCourse';
import { AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Apply dark mode to document element
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  // API Key state
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Active course & view state (first checks if a course is passed in the URL, then local storage)
  const [currentCourse, setCurrentCourse] = useState<Course | null>(() => {
    const sharedFromUrl = getSharedCourseFromUrl();
    if (sharedFromUrl) {
      return sharedFromUrl;
    }
    const saved = localStorage.getItem('current_course_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return null;
  });

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Generate course by topic/prompt
  const handleGenerateCourse = async (formData: CourseFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStepText('Iniciando diseño instruccional...');

    try {
      if (apiKey.trim()) {
        // Mode 1: Gemini Cloud
        setLoadingStepText('Conectando con Google Gemini en la nube...');
        const course = await generateCourseWithGemini(
          { ...formData, apiKey },
          (status) => setLoadingStepText(status)
        );
        setCurrentCourse(course);
        localStorage.setItem('current_course_data', JSON.stringify(course));
      } else {
        // Mode 2: 100% Autonomous Local Synthesis - NO API KEY REQUIRED!
        setLoadingStepText('Diseñando rutas pedagógicas con el motor autónomo local...');
        await new Promise((r) => setTimeout(r, 600));
        setLoadingStepText('Estructurando lecciones, videos, actividades y plantillas Excel...');
        await new Promise((r) => setTimeout(r, 600));

        const course = buildCourseFromTopic(formData);
        setCurrentCourse(course);
        localStorage.setItem('current_course_data', JSON.stringify(course));
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error al generar curso:', err);
      // Fallback to local engine automatically so user is never blocked!
      try {
        setLoadingStepText('Generando con el motor instruccional local...');
        const localCourse = buildCourseFromTopic(formData);
        setCurrentCourse(localCourse);
        localStorage.setItem('current_course_data', JSON.stringify(localCourse));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (fallbackErr: any) {
        setErrorMessage(
          err.message || 'No se pudo conectar con la API de Gemini. Revisa tu clave o prueba de nuevo.'
        );
      }
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  // Generate course from uploaded documents (PPTX, PDF, DOCX, TXT)
  const handleGenerateFromDocuments = async (docs: ParsedDocument[], formData: CourseFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStepText('Analizando diapositivas y secciones documentales...');

    try {
      if (apiKey.trim()) {
        // Mode 1: Gemini Cloud with Document Grounding
        setLoadingStepText('Sintetizando contenidos con Gemini y tus documentos...');
        const documentContext = docs
          .map(d => `--- Archivo: ${d.name} ---\n${d.extractedText}`)
          .join('\n\n');

        const course = await generateCourseWithGemini(
          { ...formData, apiKey },
          (status) => setLoadingStepText(status),
          documentContext
        );

        setCurrentCourse(course);
        localStorage.setItem('current_course_data', JSON.stringify(course));
      } else {
        // Mode 2: 100% Autonomous Local Synthesis from Documents - NO API KEY REQUIRED!
        setLoadingStepText('Estructurando rutas de aprendizaje de tus diapositivas y documentos...');
        await new Promise((r) => setTimeout(r, 800));

        const localCourse = buildCourseFromDocuments(docs, formData);
        setCurrentCourse(localCourse);
        localStorage.setItem('current_course_data', JSON.stringify(localCourse));
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error al generar curso desde documentos:', err);
      try {
        setLoadingStepText('Recuperando estructura mediante motor instruccional local...');
        const fallbackCourse = buildCourseFromDocuments(docs, formData);
        setCurrentCourse(fallbackCourse);
        localStorage.setItem('current_course_data', JSON.stringify(fallbackCourse));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (fallbackErr: any) {
        setErrorMessage(`No se pudo procesar el material: ${err.message || 'Error desconocido'}`);
      }
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  const handleResetCourse = () => {
    setCurrentCourse(null);
    localStorage.removeItem('current_course_data');
    if (window.location.hash) {
      window.history.pushState('', document.title, window.location.pathname + window.location.search);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoadDemo = () => {
    setCurrentCourse(DEMO_COURSE);
    localStorage.setItem('current_course_data', JSON.stringify(DEMO_COURSE));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCourseImported = (imported: Course) => {
    setCurrentCourse(imported);
    localStorage.setItem('current_course_data', JSON.stringify(imported));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0e17] text-slate-800 dark:text-slate-100 transition-colors flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        isInCourseView={Boolean(currentCourse)}
        onResetCourse={handleResetCourse}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onCourseImported={handleCourseImported}
      />

      {/* Error notification banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto w-full px-4 pt-4">
          <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-800 dark:text-rose-200 flex items-start justify-between gap-3 shadow-sm animate-in fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-semibold">
                  Aviso:
                </strong>
                <p className="text-xs sm:text-sm mt-0.5 leading-relaxed">
                  {errorMessage}
                </p>
                <div className="mt-2 flex gap-3">
                  <button
                    onClick={handleLoadDemo}
                    className="text-xs font-bold underline hover:text-rose-950 dark:hover:text-white"
                  >
                    Cargar aula virtual de muestra interactiva
                  </button>
                  <button
                    onClick={() => setIsApiKeyModalOpen(true)}
                    className="text-xs font-bold underline hover:text-rose-950 dark:hover:text-white"
                  >
                    Revisar Gemini API Key
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => setErrorMessage(null)}
              className="p-1 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-900 text-rose-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Views */}
      <div className="flex-1">
        {!currentCourse ? (
          <CourseDesignHome
            onGenerate={handleGenerateCourse}
            onGenerateFromDocuments={handleGenerateFromDocuments}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
            hasApiKey={Boolean(apiKey)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        ) : (
          <CourseView course={currentCourse} />
        )}
      </div>

      {/* API Key configuration modal */}
      <ApiKeyModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        onKeySaved={(newKey) => setApiKey(newKey)}
      />

      {/* Share Course Modal */}
      {currentCourse && (
        <ShareCourseModal
          course={currentCourse}
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
        />
      )}

    </div>
  );
};

export default App;
