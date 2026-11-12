import React, { useState } from 'react';
import { 
  Share2, 
  Copy, 
  Check, 
  Download, 
  X, 
  Globe, 
  Laptop 
} from 'lucide-react';
import type { Course } from '../types/course';
import { generateShareableUrl, exportCourseAsFile } from '../utils/courseSharing';

interface ShareCourseModalProps {
  course: Course;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareCourseModal: React.FC<ShareCourseModalProps> = ({
  course,
  isOpen,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareUrl = generateShareableUrl(course);
  const isLocalhost = typeof window !== 'undefined' && window.location.hostname === 'localhost';

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExport = () => {
    exportCourseAsFile(course);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-purple-100 dark:border-slate-800 p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Compartir Aula Virtual
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Comparte este curso completo con alumnos o colegas
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Option 1: Shareable URL */}
        <div className="space-y-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            1. Enlace directo del curso
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate font-mono select-all"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-bold rounded-xl text-white bg-violet-600 hover:bg-violet-500 shadow-md shadow-violet-500/20 flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copiar enlace</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
            El enlace contiene <strong>todo el curso integrado</strong> (rutas, videos, lecciones, cuestionarios y materiales). Quien lo abra entrará directamente al aula virtual diseñada, <strong>sin necesidad de crear cuentas, ni registrarse, ni instalar nada</strong>.
          </p>
        </div>

        {/* Option 2: Export course file */}
        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
              2. Descargar Paquete del Curso (.json)
            </h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              Guarda el curso en un archivo para enviarlo por WhatsApp, email o Drive.
            </p>
          </div>
          <button
            type="button"
            onClick={handleExport}
            className="px-3.5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-700 hover:bg-slate-100 border border-slate-200 dark:border-slate-600 rounded-xl flex items-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
            <span>Descargar archivo</span>
          </button>
        </div>

        {/* Localhost vs Cloud Deployment Notice */}
        {isLocalhost ? (
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 text-xs text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <Laptop className="w-4 h-4 text-amber-600 shrink-0" />
              <span>¿Cómo enviarlo a cualquier persona por Internet?</span>
            </div>
            <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
              Ahora mismo estás en tu entorno de desarrollo (<code className="font-mono bg-amber-100 dark:bg-amber-900/50 px-1 py-0.5 rounded">localhost</code>). Para que el enlace sea accesible desde cualquier parte del mundo, basta con subir la aplicación a un hosting gratuito como <strong>Vercel, Netlify o GitHub Pages</strong> en 2 minutos. Al no requerir base de datos, ¡los enlaces funcionarán instantáneamente para todos tus alumnos!
            </p>
          </div>
        ) : (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>¡Tu enlace ya es público y accesible desde cualquier dispositivo!</span>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
