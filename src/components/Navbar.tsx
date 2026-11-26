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
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import type { Course, AppActiveView, StudentUser } from '../types/course';
import { importCourseFromFile } from '../utils/courseSharing';
import type { LegalTabType } from './LegalModal';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenApiKeyModal?: () => void;
  hasApiKey?: boolean;
  activeView: AppActiveView;
  onChangeView: (view: AppActiveView) => void;
  currentUser: StudentUser | null;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenTeacherManager?: () => void;
  onOpenShareModal?: () => void;
  onCourseImported?: (course: Course) => void;
  onOpenLegal?: (tab: LegalTabType) => void;
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
  onOpenLegal,
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

  const isTeacherOrAdmin = Boolean(
    currentUser && (
      currentUser.email.toLowerCase() === 'eric.palomino1512@gmail.com' ||
      currentUser.email.toLowerCase() === 'ericpalomino1512@gmail.com' ||
      currentUser.email.toLowerCase() === 'hola@tucorretaje.com' ||
      currentUser.email.toLowerCase().includes('admin') ||
      currentUser.role === 'admin' ||
      currentUser.role === 'teacher'
    )
  );

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 dark:bg-slate-900/95 border-b border-slate-200/80 dark:border-slate-800 transition-colors shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onChangeView('landing')}
            className="flex items-center gap-2.5 cursor-pointer group"
            role="button"
            tabIndex={0}
            title="Ir a la portada principal de Tus Cursos Inmobiliarios"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  TusCursos<span className="text-indigo-600 dark:text-indigo-400">Inmobiliarios</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 dark:bg-indigo-950/70 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800">
                  Campus
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
                Especialización Práctica Inmobiliaria
              </p>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100/90 dark:bg-slate-800/90 p-1 rounded-2xl border border-slate-200/70 dark:border-slate-700/60">
          <button
            onClick={() => onChangeView('landing')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'landing'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Inicio
          </button>

          <button
            onClick={() => onChangeView('catalog')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'catalog'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Catálogo
          </button>

          {onOpenLegal && (
            <button
              onClick={() => onOpenLegal('about')}
              className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all cursor-pointer"
            >
              Quiénes Somos
            </button>
          )}

          <a
            href="https://tucorretaje.com/blog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
          >
            <span>Blog</span>
            <ExternalLink className="w-3 h-3 opacity-60" />
          </a>

          <button
            onClick={() => onChangeView('my-courses')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeView === 'my-courses'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mis Cursos
          </button>

          {/* User Dashboard Tab */}
          {currentUser && (
            <button
              onClick={() => onChangeView('dashboard')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'dashboard'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Dashboard
            </button>
          )}

          {/* Creator link only for teachers / admins */}
          {isTeacherOrAdmin && (
            <button
              onClick={() => onChangeView('course-creator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeView === 'course-creator'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Crear Curso</span>
            </button>
          )}
        </nav>

        {/* Actions & Profile */}
        <div className="flex items-center gap-2">
          
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
                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
                title="Volver al catálogo"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Catálogo</span>
              </button>

              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
                title="Compartir curso con enlace"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>
            </>
          )}

          {/* Superadmin button: Manage teachers */}
          {Boolean(currentUser && (
            currentUser.email.toLowerCase() === 'eric.palomino1512@gmail.com' ||
            currentUser.email.toLowerCase() === 'ericpalomino1512@gmail.com' ||
            currentUser.email.toLowerCase() === 'hola@tucorretaje.com'
          )) && (
            <>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                title="Abrir archivo de curso (.json)"
              >
                <FolderOpen className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenTeacherManager}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-amber-800 dark:text-amber-200 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/60 border border-amber-200 dark:border-amber-800/60 transition-colors shadow-xs cursor-pointer"
                title="Panel de Superadmin: Gestionar profesores aprobados"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Aprobar Profesores</span>
              </button>
            </>
          )}

          {/* User Auth Buttons */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onChangeView('dashboard')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-xs font-bold shadow-xs hover:from-indigo-700 hover:to-violet-700 transition-all cursor-pointer"
                title="Ir a Mi Campus"
              >
                <GraduationCap className="w-4 h-4" />
                <span className="hidden sm:inline">Mi Campus</span>
              </button>

              <button
                onClick={() => onOpenAuthModal('login')}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                title="Ver perfil o cerrar sesión"
              >
                <User className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span className="max-w-[100px] truncate">
                  {currentUser.name}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all cursor-pointer"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="hidden sm:inline-flex px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-100 transition-all cursor-pointer shadow-xs"
              >
                Registrarse
              </button>
              <button
                onClick={() => onOpenAuthModal('login')}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs hover:bg-indigo-700 transition-all cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                <span>Mi Campus</span>
              </button>
            </div>
          )}

          {/* Theme switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-100 dark:border-slate-800 py-2 bg-slate-50/70 dark:bg-slate-900/70 text-xs">
        <button
          onClick={() => onChangeView('landing')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'landing' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <span>Inicio</span>
        </button>
        <button
          onClick={() => onChangeView('catalog')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'catalog' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Catálogo</span>
        </button>
        <button
          onClick={() => onChangeView('my-courses')}
          className={`flex items-center gap-1 font-semibold ${
            activeView === 'my-courses' ? 'text-indigo-600 font-bold' : 'text-slate-500'
          }`}
        >
          <GraduationCap className="w-3.5 h-3.5" />
          <span>Mis Cursos</span>
        </button>
        {isTeacherOrAdmin && (
          <button
            onClick={() => onChangeView('course-creator')}
            className={`flex items-center gap-1 font-semibold ${
              activeView === 'course-creator' ? 'text-indigo-600 font-bold' : 'text-slate-500'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5 text-indigo-600" />
            <span>Crear</span>
          </button>
        )}
      </div>
    </header>
  );
};
