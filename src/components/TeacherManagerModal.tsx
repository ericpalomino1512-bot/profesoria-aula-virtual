import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { 
  Users, 
  UserPlus, 
  Trash2, 
  Check, 
  AlertCircle, 
  Loader2, 
  X, 
  ShieldCheck
} from 'lucide-react';

interface TeacherManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminEmail: string;
}

interface AuthorizedTeacher {
  id: string;
  email: string;
  full_name: string;
  approved_by: string;
  created_at: string;
}

export const TeacherManagerModal: React.FC<TeacherManagerModalProps> = ({
  isOpen,
  onClose,
  adminEmail,
}) => {
  const [teachers, setTeachers] = useState<AuthorizedTeacher[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [newEmail, setNewEmail] = useState<string>('');
  const [newName, setNewName] = useState<string>('');
  const [saving, setSaving] = useState<boolean>(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('authorized_teachers')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTeachers(data);
      }
    } catch (e) {}
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      fetchTeachers();
      setMessage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;

    setSaving(true);
    setMessage(null);

    const emailNorm = newEmail.trim().toLowerCase();

    try {
      const { error } = await supabase.from('authorized_teachers').insert({
        email: emailNorm,
        full_name: newName.trim() || emailNorm.split('@')[0],
        approved_by: adminEmail,
      });

      if (error) {
        if (error.code === '23505') {
          setMessage({ text: 'Ese correo ya está en la lista de profesores aprobados.', type: 'error' });
        } else {
          setMessage({ text: error.message || 'Error al autorizar profesor.', type: 'error' });
        }
      } else {
        setMessage({ text: `¡Profesor ${emailNorm} aprobado con éxito! Ya puede registrarse en el campus.`, type: 'success' });
        setNewEmail('');
        setNewName('');
        fetchTeachers();
      }
    } catch (err: any) {
      setMessage({ text: err.message || 'Error de conexión', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeacher = async (teacher: AuthorizedTeacher) => {
    if (!confirm(`¿Deseas revocar el permiso de profesor a ${teacher.email}?`)) return;

    try {
      await supabase.from('authorized_teachers').delete().eq('id', teacher.id);
      fetchTeachers();
    } catch (e) {}
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 sm:p-7 space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Gestión de Profesores Aprobados
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Autoriza qué docentes pueden crear y publicar cursos en tu Campus
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

        {/* Notifications */}
        {message && (
          <div className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
            message.type === 'success' 
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-900'
              : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 border border-rose-200 dark:border-rose-900'
          }`}>
            {message.type === 'success' ? <Check className="w-4 h-4 text-emerald-500 shrink-0" /> : <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Add new teacher form */}
        <form onSubmit={handleAddTeacher} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
            <UserPlus className="w-4 h-4 text-violet-600 dark:text-violet-400" />
            <span>Aprobar Nuevo Profesor</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Nombre del docente (Ej. Carlos Ramos)"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="correo@profesor.com"
                className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving || !newEmail.trim()}
            className="w-full py-2 px-3 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 rounded-xl shadow-xs transition-transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-1.5"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
            <span>Aprobar y Conceder Acceso Docente</span>
          </button>
        </form>

        {/* Existing teachers list */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span className="font-bold uppercase tracking-wider">Profesores Aprobados Actualmente</span>
            <span>{teachers.length} registrados</span>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-violet-500" />
              <span>Cargando lista desde Supabase...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="py-6 text-center text-xs text-slate-400 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              No hay profesores externos en la lista. Solo los superadministradores tienen acceso.
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden bg-white dark:bg-slate-900">
              {teachers.map((t) => {
                const isSuperadmin = t.email === 'ericpalomino1512@gmail.com' || t.email === 'hola@tucorretaje.com';

                return (
                  <div key={t.id} className="p-3 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5 truncate">
                      <div className="w-7 h-7 rounded-lg bg-violet-50 dark:bg-violet-950/50 text-violet-600 dark:text-violet-400 flex items-center justify-center shrink-0">
                        <Users className="w-3.5 h-3.5" />
                      </div>
                      <div className="truncate">
                        <strong className="block text-slate-800 dark:text-slate-200 truncate">
                          {t.full_name || t.email.split('@')[0]}
                        </strong>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                          {t.email}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {isSuperadmin ? (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300">
                          Superadmin
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleDeleteTeacher(t)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Revocar acceso de profesor"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

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
