import React, { useState } from 'react';
import type { StudentUser } from '../types/course';
import { 
  signUpStudent, 
  signInStudent, 
  resetStudentPassword 
} from '../services/authService';
import { 
  User, 
  Mail, 
  Lock, 
  X, 
  Check, 
  LogIn, 
  UserPlus, 
  KeyRound, 
  AlertCircle, 
  Loader2, 
  GraduationCap, 
  BookOpen 
} from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  currentUser: StudentUser | null;
  initialMode?: 'login' | 'register' | 'forgot';
  initialRoleTarget?: 'student' | 'teacher';
  onClose: () => void;
  onLogin: (user: StudentUser) => void;
  onLogout: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  currentUser,
  initialMode = 'login',
  initialRoleTarget = 'student',
  onClose,
  onLogin,
  onLogout,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [roleTarget, setRoleTarget] = useState<'student' | 'teacher'>(initialRoleTarget);

  // Sync mode and role when modal opens
  React.useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setRoleTarget(initialRoleTarget);
    }
  }, [isOpen, initialMode, initialRoleTarget]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const isTeacherTarget = roleTarget === 'teacher';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setLoading(true);

    try {
      if (mode === 'register') {
        const res = await signUpStudent(email.trim(), password, name.trim(), isTeacherTarget);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.user) {
          onLogin(res.user);
          setSuccessMessage(isTeacherTarget ? '¡Cuenta docente verificada con éxito! Bienvenido.' : '¡Cuenta creada con éxito! Bienvenido al Campus.');
          setTimeout(() => onClose(), 1200);
        }
      } else if (mode === 'login') {
        const res = await signInStudent(email.trim(), password);
        if (res.error) {
          setErrorMessage(res.error);
        } else if (res.user) {
          onLogin(res.user);
          onClose();
        }
      } else if (mode === 'forgot') {
        const res = await resetStudentPassword(email.trim());
        if (res.error) {
          setErrorMessage(res.error);
        } else {
          setSuccessMessage('Te hemos enviado un correo con instrucciones para restablecer tu contraseña.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error en la autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-5">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              {isTeacherTarget ? <GraduationCap className="w-5 h-5" /> : <User className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {currentUser 
                  ? (currentUser.role === 'admin' || currentUser.role === 'teacher' ? 'Perfil de Profesor / Admin' : 'Mi Perfil de Alumno')
                  : mode === 'register' 
                    ? (isTeacherTarget ? 'Registro de Profesor Aprobado' : 'Registro de Nuevo Alumno') 
                    : mode === 'forgot'
                      ? 'Recuperar Contraseña'
                      : (isTeacherTarget ? 'Ingreso para Profesores' : 'Ingreso para Alumnos')}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {currentUser 
                  ? 'Gestión de tu cuenta en la nube' 
                  : isTeacherTarget 
                    ? 'Requiere autorización previa de administración'
                    : 'Accede a tus cursos y guarda tu progreso'}
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

        {/* Role Selector Tabs (Only when not logged in) */}
        {!currentUser && (
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/60 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setRoleTarget('student');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                roleTarget === 'student'
                  ? 'bg-white dark:bg-slate-900 text-violet-700 dark:text-violet-300 shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Soy Alumno</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setRoleTarget('teacher');
                setErrorMessage(null);
              }}
              className={`flex items-center justify-center gap-1.5 py-2 rounded-xl transition-all ${
                roleTarget === 'teacher'
                  ? 'bg-violet-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-800 dark:text-slate-400'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Soy Profesor</span>
            </button>
          </div>
        )}

        {/* Notifications */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/50 text-xs text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{successMessage}</span>
          </div>
        )}

        {currentUser ? (
          /* Profile active state */
          <div className="space-y-5">
            <div className="p-4 rounded-2xl bg-violet-50/60 dark:bg-violet-950/30 border border-violet-100 dark:border-violet-900/40 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold text-violet-800 dark:text-violet-300">
                <Check className="w-4 h-4 text-emerald-500" />
                <span>Sesión activa en Supabase Cloud</span>
              </div>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100">
                {currentUser.name}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {currentUser.email}
              </p>
              <div className="pt-2 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                <span>Rol: <strong>{currentUser.role === 'admin' ? 'Superadministrador' : currentUser.role === 'teacher' ? 'Profesor Docente' : 'Alumno'}</strong></span>
                <span>Cursos: <strong>{currentUser.enrolledCourseIds.length}</strong></span>
              </div>
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
          /* Form Login / Register / Forgot */
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
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
                    placeholder={isTeacherTarget ? "Ej. Prof. Eric Palomino" : "Ej. Juan Pérez"}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Correo electrónico {isTeacherTarget && <span className="text-violet-600 dark:text-violet-400 font-semibold">(correo autorizado)</span>}
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={isTeacherTarget ? "tu-correo-docente@ejemplo.com" : "alumno@ejemplo.com"}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
                />
              </div>
            </div>

            {mode !== 'forgot' && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Contraseña
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => setMode('forgot')}
                      className="text-[11px] text-violet-600 dark:text-violet-400 hover:underline"
                    >
                      ¿Olvidaste tu contraseña?
                    </button>
                  )}
                </div>
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
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-md shadow-violet-500/20 flex items-center justify-center gap-1.5 transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : mode === 'register' ? (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{isTeacherTarget ? 'Registrarme como Profesor' : 'Crear mi cuenta de Alumno'}</span>
                </>
              ) : mode === 'forgot' ? (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Enviar enlace de recuperación</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>{isTeacherTarget ? 'Entrar al Panel de Profesor' : 'Entrar al Campus'}</span>
                </>
              )}
            </button>

            {/* Switch mode links */}
            <div className="pt-2 flex flex-col items-center gap-1.5 text-xs text-center">
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-violet-600 dark:text-violet-400 hover:underline"
                >
                  {isTeacherTarget ? '¿Profesor aprobado? ' : '¿No tienes cuenta? '} 
                  <strong>Regístrate aquí</strong>
                </button>
              )}

              {mode === 'register' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-violet-600 dark:text-violet-400 hover:underline"
                >
                  ¿Ya tienes cuenta? <strong>Inicia sesión</strong>
                </button>
              )}

              {mode === 'forgot' && (
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-violet-600 dark:text-violet-400 hover:underline"
                >
                  ← Volver a Iniciar Sesión
                </button>
              )}
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
