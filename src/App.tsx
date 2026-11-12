import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { CourseCatalog } from './components/CourseCatalog';
import { MyCoursesView } from './components/MyCoursesView';
import { CourseDesignHome } from './components/CourseDesignHome';
import { CourseView } from './components/CourseView';
import { ApiKeyModal } from './components/ApiKeyModal';
import { ShareCourseModal } from './components/ShareCourseModal';
import { AuthModal } from './components/AuthModal';
import type { Course, CourseFormData, AppActiveView, StudentUser, CourseProgress } from './types/course';
import { generateCourseWithGemini, getStoredApiKey } from './services/geminiService';
import { buildCourseFromDocuments, buildCourseFromTopic } from './services/localCourseEngine';
import type { ParsedDocument } from './services/documentParser';
import { getSharedCourseFromUrl } from './utils/courseSharing';
import { DEMO_COURSE } from './services/demoCourse';
import { 
  getStoredCatalog, 
  saveCatalogCourse, 
  getEnrolledCourseIds, 
  enrollInCourse 
} from './services/catalogService';
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

  // Student User Session State
  const [currentUser, setCurrentUser] = useState<StudentUser | null>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('profesoria_student_user');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {}
      }
    }
    return null;
  });
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Catalog & Enrollment State
  const [catalogCourses, setCatalogCourses] = useState<Course[]>(() => getStoredCatalog());
  const [enrolledIds, setEnrolledIds] = useState<string[]>(() => getEnrolledCourseIds());

  // Active view: 'catalog' | 'my-courses' | 'course-viewer' | 'course-creator'
  const [activeView, setActiveView] = useState<AppActiveView>(() => {
    // If URL has a shared course hash, open viewer immediately
    const sharedFromUrl = getSharedCourseFromUrl();
    if (sharedFromUrl) return 'course-viewer';
    return 'catalog';
  });

  // Active course for viewer
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

  // Progress map per course
  const [progressMap, setProgressMap] = useState<Record<string, CourseProgress>>({});

  useEffect(() => {
    // Load progress for each catalog course
    const map: Record<string, CourseProgress> = {};
    catalogCourses.forEach(c => {
      const saved = localStorage.getItem(`progress_${c.id}`);
      if (saved) {
        try {
          map[c.id] = JSON.parse(saved);
        } catch (e) {}
      }
    });
    setProgressMap(map);
  }, [catalogCourses]);

  // API Key state
  const [apiKey, setApiKey] = useState<string>(getStoredApiKey());
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Loading and error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStepText, setLoadingStepText] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle course selection
  const handleSelectCourse = (course: Course) => {
    setCurrentCourse(course);
    localStorage.setItem('current_course_data', JSON.stringify(course));
    setActiveView('course-viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle student enrollment
  const handleEnrollCourse = (course: Course) => {
    enrollInCourse(course.id);
    const updated = getEnrolledCourseIds();
    setEnrolledIds(updated);
    if (!currentUser) {
      setIsAuthModalOpen(true);
    }
    handleSelectCourse(course);
  };

  // Generate course by topic/prompt
  const handleGenerateCourse = async (formData: CourseFormData) => {
    setIsLoading(true);
    setErrorMessage(null);
    setLoadingStepText('Iniciando diseño instruccional...');

    try {
      let course: Course;
      if (apiKey.trim()) {
        // Mode 1: Gemini Cloud
        setLoadingStepText('Conectando con Google Gemini en la nube...');
        course = await generateCourseWithGemini(
          { ...formData, apiKey },
          (status) => setLoadingStepText(status)
        );
      } else {
        // Mode 2: 100% Autonomous Local Synthesis - NO API KEY REQUIRED!
        setLoadingStepText('Diseñando rutas pedagógicas con el motor autónomo local...');
        await new Promise((r) => setTimeout(r, 600));
        setLoadingStepText('Estructurando lecciones, videos, actividades y plantillas Excel...');
        await new Promise((r) => setTimeout(r, 600));

        course = buildCourseFromTopic(formData);
      }

      // Add to catalog & enroll author
      saveCatalogCourse(course);
      enrollInCourse(course.id);
      setCatalogCourses(getStoredCatalog());
      setEnrolledIds(getEnrolledCourseIds());

      setCurrentCourse(course);
      localStorage.setItem('current_course_data', JSON.stringify(course));
      setActiveView('course-viewer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error al generar curso:', err);
      try {
        setLoadingStepText('Generando con el motor instruccional local...');
        const localCourse = buildCourseFromTopic(formData);
        saveCatalogCourse(localCourse);
        enrollInCourse(localCourse.id);
        setCatalogCourses(getStoredCatalog());
        setEnrolledIds(getEnrolledCourseIds());

        setCurrentCourse(localCourse);
        localStorage.setItem('current_course_data', JSON.stringify(localCourse));
        setActiveView('course-viewer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (fallbackErr: any) {
        setErrorMessage(
          err.message || 'No se pudo generar el curso. Prueba de nuevo.'
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
      let course: Course;
      if (apiKey.trim()) {
        setLoadingStepText('Sintetizando contenidos con Gemini y tus documentos...');
        const documentContext = docs
          .map(d => `--- Archivo: ${d.name} ---\n${d.extractedText}`)
          .join('\n\n');

        course = await generateCourseWithGemini(
          { ...formData, apiKey },
          (status) => setLoadingStepText(status),
          documentContext
        );
      } else {
        setLoadingStepText('Estructurando rutas de aprendizaje de tus diapositivas y documentos...');
        await new Promise((r) => setTimeout(r, 800));

        course = buildCourseFromDocuments(docs, formData);
      }

      // Add to catalog & enroll author
      saveCatalogCourse(course);
      enrollInCourse(course.id);
      setCatalogCourses(getStoredCatalog());
      setEnrolledIds(getEnrolledCourseIds());

      setCurrentCourse(course);
      localStorage.setItem('current_course_data', JSON.stringify(course));
      setActiveView('course-viewer');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error al generar curso desde documentos:', err);
      try {
        setLoadingStepText('Recuperando estructura mediante motor instruccional local...');
        const fallbackCourse = buildCourseFromDocuments(docs, formData);
        saveCatalogCourse(fallbackCourse);
        enrollInCourse(fallbackCourse.id);
        setCatalogCourses(getStoredCatalog());
        setEnrolledIds(getEnrolledCourseIds());

        setCurrentCourse(fallbackCourse);
        localStorage.setItem('current_course_data', JSON.stringify(fallbackCourse));
        setActiveView('course-viewer');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (fallbackErr: any) {
        setErrorMessage(`No se pudo procesar el material: ${err.message || 'Error desconocido'}`);
      }
    } finally {
      setIsLoading(false);
      setLoadingStepText('');
    }
  };

  const handleCourseImported = (imported: Course) => {
    saveCatalogCourse(imported);
    enrollInCourse(imported.id);
    setCatalogCourses(getStoredCatalog());
    setEnrolledIds(getEnrolledCourseIds());
    setCurrentCourse(imported);
    localStorage.setItem('current_course_data', JSON.stringify(imported));
    setActiveView('course-viewer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const enrolledCoursesList = catalogCourses.filter(c => enrolledIds.includes(c.id));

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0c0e17] text-slate-800 dark:text-slate-100 transition-colors flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      
      {/* Top Navigation */}
      <Navbar
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode(!darkMode)}
        onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
        hasApiKey={Boolean(apiKey)}
        activeView={activeView}
        onChangeView={(view) => {
          setActiveView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
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
                    onClick={() => handleSelectCourse(DEMO_COURSE)}
                    className="text-xs font-bold underline hover:text-rose-950 dark:hover:text-white"
                  >
                    Cargar aula de muestra interactiva
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

      {/* Main Views Coordinator */}
      <main className="flex-1">
        {activeView === 'catalog' && (
          <CourseCatalog
            courses={catalogCourses}
            enrolledCourseIds={enrolledIds}
            onSelectCourse={handleSelectCourse}
            onEnrollCourse={handleEnrollCourse}
            onOpenCreator={() => setActiveView('course-creator')}
          />
        )}

        {activeView === 'my-courses' && (
          <MyCoursesView
            enrolledCourses={enrolledCoursesList}
            progressMap={progressMap}
            onSelectCourse={handleSelectCourse}
            onExploreCatalog={() => setActiveView('catalog')}
          />
        )}

        {activeView === 'course-creator' && (
          <CourseDesignHome
            onGenerate={handleGenerateCourse}
            onGenerateFromDocuments={handleGenerateFromDocuments}
            isLoading={isLoading}
            loadingStepText={loadingStepText}
            hasApiKey={Boolean(apiKey)}
            onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          />
        )}

        {activeView === 'course-viewer' && currentCourse && (
          <CourseView course={currentCourse} />
        )}
      </main>

      {/* Auth / Student Profile Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        currentUser={currentUser}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={(user) => setCurrentUser(user)}
        onLogout={() => {
          localStorage.removeItem('profesoria_student_user');
          setCurrentUser(null);
        }}
      />

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
