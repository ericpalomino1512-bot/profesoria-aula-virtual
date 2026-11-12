import React, { useState } from 'react';
import { X, Key, ExternalLink, Check, AlertCircle } from 'lucide-react';
import { getStoredApiKey, setStoredApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: (key: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState(getStoredApiKey());
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    setStoredApiKey(apiKey);
    onKeySaved(apiKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 800);
  };

  const handleClear = () => {
    setApiKey('');
    setStoredApiKey('');
    onKeySaved('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-purple-100 dark:border-slate-800 p-6 overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                Clave API de Google Gemini
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Para generar cursos ilimitados en tiempo real
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-3">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            ProfesorIA utiliza el modelo <strong className="text-violet-600 dark:text-violet-400">Gemini 2.5 Flash</strong> con <strong className="text-violet-600 dark:text-violet-400">Google Search Grounding</strong> para estructurar los contenidos con fuentes reales.
          </p>

          <div>
            <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Tu Gemini API Key
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-between pt-1 text-xs">
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-violet-600 dark:text-violet-400 hover:underline font-medium"
            >
              Obtener clave gratuita en Google AI Studio
              <ExternalLink className="w-3 h-3" />
            </a>
            {apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="text-rose-500 hover:underline"
              >
                Eliminar clave
              </button>
            )}
          </div>

          <div className="p-3 rounded-xl bg-violet-50 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/50 flex items-start gap-2 text-xs text-violet-900 dark:text-violet-200">
            <AlertCircle className="w-4 h-4 text-violet-600 dark:text-violet-400 shrink-0 mt-0.5" />
            <span>
              Tu clave se almacena exclusivamente en el almacenamiento local de tu navegador (localStorage). Si no tienes clave ahora, puedes probar la app igualmente con el curso de muestra interactivo de Química Orgánica.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-medium text-white bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 rounded-xl shadow-sm transition-all"
          >
            {savedSuccess ? (
              <>
                <Check className="w-4 h-4" /> Guardado
              </>
            ) : (
              'Guardar clave'
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
