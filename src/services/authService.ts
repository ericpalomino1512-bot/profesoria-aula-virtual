import { supabase } from './supabaseClient';
import type { StudentUser } from '../types/course';

export interface AuthResponse {
  user: StudentUser | null;
  error: string | null;
}

// Register new student with Email & Password
export const signUpStudent = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
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
      };

      // Save initial profile in table
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email: student.email,
        full_name: student.name,
        enrolled_courses: student.enrolledCourseIds,
        updated_at: new Date().toISOString(),
      });

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
      // Fetch enrolled courses from profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('enrolled_courses, full_name')
        .eq('id', data.user.id)
        .single();

      const enrolled = profile?.enrolled_courses || ['captacion-exclusivas-ia', 'marketing-inmobiliario-redes'];
      const fullName = profile?.full_name || data.user.user_metadata?.full_name || email.split('@')[0];

      const student: StudentUser = {
        id: data.user.id,
        email: data.user.email || email,
        name: fullName,
        enrolledCourseIds: enrolled,
        registeredAt: data.user.created_at,
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
      .select('enrolled_courses, full_name')
      .eq('id', session.user.id)
      .single();

    return {
      id: session.user.id,
      email: session.user.email || '',
      name: profile?.full_name || session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Alumno',
      enrolledCourseIds: profile?.enrolled_courses || ['captacion-exclusivas-ia', 'marketing-inmobiliario-redes'],
      registeredAt: session.user.created_at,
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
