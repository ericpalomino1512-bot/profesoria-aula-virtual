import React from 'react';
import { ShieldAlert, Lock, ArrowLeft, LogIn } from 'lucide-react';

interface ProtectedCreatorGateProps {
  onBackToCatalog: () => void;
  onOpenLogin: () => void;
  isLoggedIn: boolean;
  currentUserEmail?: string;
}

export const ProtectedCreatorGate: React.FC<ProtectedCreatorGateProps> = ({
  onBackToCatalog,
  onOpenLogin,
  isLoggedIn,
  currentUserEmail,
}) => {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 sm:py-24 text-center space-y-6 animate-in fade-in">
      <div className="w-16 h-16 mx-auto rounded-3xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shadow-lg shadow-amber-500/10">
        <Lock className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
          Zona Exclusiva para Profesores y Administradores
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto leading-relaxed">
          {isLoggedIn ? (
            <>
              Has iniciado sesión como <strong className="font-mono text-slate-800 dark:text-slate-200">{currentUserEmail}</strong>, pero esta cuenta no tiene permisos de profesor para crear o editar cursos en la plataforma.
            </>
          ) : (
            'Para diseñar cursos, subir diapositivas o generar contenidos con IA, debes identificarte con tu cuenta de profesor o administrador.'
          )}
        </p>
      </div>

      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto flex items-center gap-3 text-left">
        <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0" />
        <span>
          Si eres el director o docente titular de TusCursosInmobiliarios, inicia sesión con tu correo autorizado para acceder al panel de diseño.
        </span>
      </div>

      <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={onBackToCatalog}
          className="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver al Catálogo</span>
        </button>

        <button
          onClick={onOpenLogin}
          className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold shadow-md shadow-violet-500/20 flex items-center gap-2 transition-transform active:scale-95"
        >
          <LogIn className="w-4 h-4" />
          <span>{isLoggedIn ? 'Cambiar a cuenta de Profesor' : 'Iniciar Sesión como Profesor'}</span>
        </button>

        <a
          href="mailto:contacto@tuscursosinmobiliarios.com?subject=Solicitud%20de%20Acceso%20Docente%20-%20TusCursosInmobiliarios&body=Hola%2C%20deseo%20solicitar%20acceso%20como%20profesor%20para%20publicar%20un%20curso%20en%20el%20Campus%20Virtual.%0A%0ANombre%20completo%3A%0ACorreo%3A%0ATema%20del%20curso%3A"
          className="px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
        >
          <span>Solicitar ser Profesor (Email)</span>
        </a>
      </div>
    </div>
  );
};
