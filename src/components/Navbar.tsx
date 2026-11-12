import React, { useRef } from 'react';
import { 
  Moon, 
  Sun, 
  Key, 
  PlusCircle, 
  GraduationCap, 
  Share2, 
  FolderOpen 
} from 'lucide-react';
import type { Course } from '../types/course';
import { importCourseFromFile } from '../utils/courseSharing';

interface NavbarProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onOpenApiKeyModal: () => void;
  hasApiKey: boolean;
  isInCourseView: boolean;
  onResetCourse?: () => void;
  onOpenShareModal?: () => void;
  onCourseImported?: (course: Course) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  darkMode,
  onToggleDarkMode,
  onOpenApiKeyModal,
  hasApiKey,
  isInCourseView,
  onResetCourse,
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-purple-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <div 
          onClick={onResetCourse}
          className="flex items-center gap-3 cursor-pointer group"
          role="button"
          tabIndex={0}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-violet-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent dark:from-violet-400 dark:to-indigo-300">
                ProfesorIA
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-purple-100 text-purple-700 dark:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Aula Virtual
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
              Diseño instruccional con Google Gemini
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          
          {/* Hidden file input for importing */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileChange}
            className="hidden"
          />

          {isInCourseView ? (
            <>
              {/* Share button */}
              <button
                onClick={onOpenShareModal}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-xs transition-transform active:scale-95"
                title="Compartir curso con enlace o archivo"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Compartir</span>
              </button>

              {/* New course button */}
              <button
                onClick={onResetCourse}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              >
                <PlusCircle className="w-4 h-4 text-violet-600 dark:text-violet-400" />
                <span className="hidden sm:inline">Nuevo curso</span>
              </button>
            </>
          ) : (
            /* Import course button when on Home */
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-xl transition-colors"
              title="Cargar un curso exportado (.json)"
            >
              <FolderOpen className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span className="hidden sm:inline">Abrir Curso</span>
            </button>
          )}

          {/* API Key configuration pill */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium rounded-xl transition-all ${
              hasApiKey
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
                : 'bg-violet-50 text-violet-700 border border-violet-200 hover:bg-violet-100 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800 dark:hover:bg-violet-900/60'
            }`}
            title="Configurar clave de Google Gemini (Opcional)"
          >
            <Key className="w-3.5 h-3.5" />
            <span className="hidden md:inline">
              {hasApiKey ? 'Gemini Conectado' : 'API Key Gemini'}
            </span>
            <span className="md:hidden">API</span>
          </button>

          {/* Theme switch */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-xl text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 dark:text-slate-300 dark:hover:text-white dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
            aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-violet-600" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
