import { createClient } from '@supabase/supabase-js';

// Supabase project connection configuration
export const SUPABASE_URL = 'https://abuwxwryefnqnfizvbuy.supabase.co';
export const SUPABASE_ANON_KEY = 'sb_publishable_KbNfP6qjHXdm-xQtHxJ48g_HHM-mMCJ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
