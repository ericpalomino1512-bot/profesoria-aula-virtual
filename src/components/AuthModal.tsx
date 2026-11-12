import React, { useState } from 'react';
import type { StudentUser } from '../types/course';
import { User, Mail, Lock, X, Check, LogIn, UserPlus } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: StudentUser | null;
  onClose: () => void;
  onLogin: (user: StudentUser) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  onClose,
  onLogin,
  onLogout,
}) => {
  const [isRegisterMode, setIsRegisterMode] = useState<boolean>(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const user: StudentUser = {
      id: 'student_' + Date.now(),
      name: name.trim() || email.split('@')[0],
      email: email.trim(),
      enrolledCourseIds: currentUser?.enrolledCourseIds || ['quimica-organica-ebau'],
      registeredAt: new Date().toISOString(),
    };

    localStorage.setItem('profesoria_student_user', JSON.stringify(user));
    onLogin(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentUser ? 'Perfil de Alumno' : isRegisterMode ? 'Crear Cuenta de Alumno' : 'Iniciar Sesión'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Guarda tu avance y accede a tus cursos comprados
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

        {currentUser ? (
          /* Profile active state */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-800 dark:text-violet-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Sesión activa en el Campus</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentUser.email}
              </p>
            </div>

            <button
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="w-full py-2.5 px-4 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/30 hover:bg-rose-100 dark:hover:bg-rose-900/40 rounded-xl transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        ) : (
          /* Form Login / Register */
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegisterMode && (
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Nombre completo
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Correo electrónico
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alumno@ejemplo.com"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95"
            >
              {isRegisterMode ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Crear mi cuenta y acceder</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Entrar al Campus</span>
                </>
              )}
            </button>

            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsRegisterMode(!isRegisterMode)}
                className="text-xs text-violet-600 dark:text-violet-400 hover:underline"
              >
                {isRegisterMode 
                  ? '¿Ya tienes cuenta? Inicia sesión' 
                  : '¿Nuevo alumno? Regístrate gratis aquí'}
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
