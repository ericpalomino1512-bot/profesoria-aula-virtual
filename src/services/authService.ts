import { supabase } from './supabaseClient';
import type { StudentUser } from '../types/course';

export interface AuthResponse {
  user: StudentUser | null;
  error: string | null;
}

// Check if an email is an authorized administrator or professor (Checks local superadmins + Supabase cloud database)
export const isAuthorizedTeacherEmail = async (email: string): Promise<boolean> => {
  const normalized = email.trim().toLowerCase();
  
  // Superadmins
  const superadmins = [
    'ericpalomino1512@gmail.com',
    'hola@tucorretaje.com'
  ];
  if (superadmins.includes(normalized)) return true;

  // Check in Supabase authorized_teachers table
  try {
    const { data } = await supabase
      .from('authorized_teachers')
      .select('email')
      .ilike('email', normalized)
      .maybeSingle();

    return Boolean(data);
  } catch (e) {
    return false;
  }
};

// Register new user with Email & Password
export const signUpStudent = async (
  email: string, 
  password: string, 
  name: string,
  isTeacherTarget: boolean = false
): Promise<AuthResponse> => {
  try {
    const isTeacher = await isAuthorizedTeacherEmail(email);

    // If attempting to register as a teacher, verify that email is pre-authorized
    if (isTeacherTarget && !isTeacher) {
      return {
        user: null,
        error: 'Tu correo no está en la lista de profesores aprobados. Debes enviar primero tu solicitud a hola@tucorretaje.com para recibir autorización.'
      };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          role: isTeacher ? 'admin' : 'student',
        },
      },
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      const student: StudentUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: data.user.user_metadata?.full_name || name || email.split('@')[0],
        enrolledCourseIds: ['captacion-exclusivas-ia', 'marketing-inmobiliario-redes'],
        registeredAt: data.user.created_at,
        role: isTeacher ? 'admin' : 'student',
      };

      // Save initial profile in table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: student.email,
        full_name: student.name,
        role: student.role,
        enrolled_courses: student.enrolledCourseIds,
        updated_at: new Date().toISOString(),
      });

      // Send registration alert to admin email hola@tucorretaje.com (non-blocking)
      try {
        fetch('https://formspree.io/f/xblywekg', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify({
            alerta: 'Nuevo Alumno Registrado en TusCursosInmobiliarios Campus',
            destinatario: 'hola@tucorretaje.com',
            alumno_nombre: student.name,
            alumno_email: student.email,
            alumno_id: student.id,
            fecha_registro: new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' }),
            origen: 'https://aula.tuscursosinmobiliarios.com',
          }),
        }).catch(() => {});
      } catch (notifyErr) {}

      return { user: student, error: null };
    }

    return { user: null, error: 'Revisa tu correo para confirmar tu cuenta.' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Error durante el registro' };
  }
};

// Sign in existing student
export const signInStudent = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { user: null, error: error.message };
    }

    if (data.user) {
      // Fetch enrolled courses and role from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('enrolled_courses, full_name, role')
        .eq('id', data.user.id)
        .single();

      const isTeacher = (await isAuthorizedTeacherEmail(data.user.email || email)) || profile?.role === 'admin' || profile?.role === 'teacher';
      const enrolled = profile?.enrolled_courses || ['captacion-exclusivas-ia', 'marketing-inmobiliario-redes'];
      const fullName = profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0];

      const student: StudentUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: fullName,
        enrolledCourseIds: enrolled,
        registeredAt: data.user.created_at,
        role: isTeacher ? 'admin' : (profile?.role || 'student'),
      };

      return { user: student, error: null };
    }

    return { user: null, error: 'Usuario no encontrado' };
  } catch (err: any) {
    return { user: null, error: err.message || 'Error al iniciar sesión' };
  }
};

// Send password reset email
export const resetStudentPassword = async (email: string): Promise<{ success: boolean; error: string | null }> => {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/#reset-password` : undefined,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Error al solicitar cambio de clave' };
  }
};

// Sign out student
export const signOutStudent = async (): Promise<void> => {
  await supabase.auth.signOut();
};

// Check active session on app load
export const getActiveStudentSession = async (): Promise<StudentUser | null> => {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session || !session.user) return null;

    const { data: profile } = await supabase
      .from('profiles')
      .select('enrolled_courses, full_name, role')
      .eq('id', session.user.id)
      .single();

    const isTeacher = (await isAuthorizedTeacherEmail(session.user.email || '')) || profile?.role === 'admin' || profile?.role === 'teacher';

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Alumno',
      enrolledCourseIds: profile?.enrolled_courses || ['captacion-exclusivas-ia', 'marketing-inmobiliario-redes'],
      registeredAt: session.user.created_at,
      role: isTeacher ? 'admin' : (profile?.role || 'student'),
    };
  } catch (e) {
    return null;
  }
};

// Enroll user into a course in Supabase cloud
export const enrollUserInSupabase = async (userId: string, courseId: string): Promise<string[]> => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('enrolled_courses')
      .eq('id', userId)
      .single();

    const current: string[] = profile?.enrolled_courses || [];
    if (!current.includes(courseId)) {
      const updated = [...current, courseId];
      await supabase.from('profiles').update({
        enrolled_courses: updated,
        updated_at: new Date().toISOString(),
      }).eq('id', userId);
      return updated;
    }
    return current;
  } catch (e) {
    return [courseId];
  }
};
