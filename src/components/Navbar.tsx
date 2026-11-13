import React, { useRef } from 'react';
import { 
  Moon, 
  Sun, 
  PlusCircle, 
  GraduationCap, 
  Share2, 
  FolderOpen,
  BookOpen,
  User,
  ArrowLeft,
  ShieldCheck
} from 'lucide-react';
import type { Course, AppActiveView, StudentUser } from '../types/course';
import { importCourseFromFile } from '../utils/courseSharing';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenApiKeyModal?: () => void;
  hasApiKey?: boolean;
  activeView: AppActiveView;
  onChangeView: (view: AppActiveView) => void;
  currentUser: StudentUser | null;
  onOpenAuthModal: () => void;
  onOpenTeacherManager?: () => void;
  onOpenShareModal?: () => void;
  onCourseImported?: (course: Course) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  activeView,
  onChangeView,
  currentUser,
  onOpenAuthModal,
  onOpenTeacherManager,
  onOpenShareModal,
  onCourseImported,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const imported = await importCourseFromFile(e.target.files[0]);
        onCourseImported?.(imported);
      } catch (err: any) {
        alert(err.message || 'Error al cargar el curso');
      }
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-purple-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onChangeView('catalog')}
            className="flex items-center gap-2.5 cursor-pointer group"
            role="button"
            tabIndex={0}
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-300">
                  TusCursosInmobiliarios
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md font-bold bg-purple-100 text-purple-700 dark:bg-purple-950/70 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                Aula Virtual & Generador IA
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Udemy Style) */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800/80 p-1 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
          <button
            onClick={() => onChangeView('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'catalog'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Catálogo
          </button>

          <button
            onClick={() => onChangeView('my-courses')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'my-courses'
                ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mis Cursos
          </button>

          <button
            onClick={() => onChangeView('course-creator')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeView === 'course-creator'
                ? 'bg-violet-600 text-white shadow-xs'
                : 'text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Crear Curso</span>
          </button>
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          
          {/* Hidden file input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* If viewing a course, show Share & Back to catalog */}
          {activeView === 'course-viewer' && (
            <>
              <button
                onClick={() => onChangeView('catalog')}
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                title="Volver al catálogo"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Catálogo</span>
              </button>

              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-xs transition-transform active:scale-95"
                title="Compartir curso con enlace"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
            </>
          )}

          {/* Quick Creator Button for mobile */}
          <button
            onClick={() => onChangeView('course-creator')}
            className="md:hidden p-2 text-violet-600 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/50 rounded-xl"
            title="Crear Curso"
          >
            <PlusCircle className="w-5 h-5" />
          </button>

          {/* Quick Import */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
            title="Abrir archivo de curso (.json)"
          >
            <FolderOpen className="w-4 h-4" />
          </button>

          {/* Superadmin button: Manage teachers */}
          {Boolean(currentUser && (
            currentUser.email.toLowerCase() === 'ericpalomino1512@gmail.com' ||
            currentUser.email.toLowerCase() === 'hola@tucorretaje.com'
          )) && (
            <button
              onClick={onOpenTeacherManager}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-amber-800 dark:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 transition-colors shadow-xs"
              title="Panel de Superadmin: Gestionar profesores aprobados"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span className="hidden lg:inline">Aprobar Profesores</span>
            </button>
          )}

          {/* Student Profile / Login button */}
          <button
            onClick={onOpenAuthModal}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            <User className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span className="max-w-[100px] truncate">
              {currentUser ? currentUser.name : 'Ingresar'}
            </span>
          </button>

          {/* Theme switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 py-2 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
        <button
          onClick={() => onChangeView('catalog')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'catalog' ? 'text-violet-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catálogo</span>
        </button>
        <button
          onClick={() => onChangeView('my-courses')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'my-courses' ? 'text-violet-600 font-bold' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Mis Cursos</span>
        </button>
        <button
          onClick={() => onChangeView('course-creator')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'course-creator' ? 'text-violet-600 font-bold' : 'text-slate-500'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5 text-violet-600" />
          <span>Crear</span>
        </button>
      </div>
    </header>
  );
};
