import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

let supabaseClient: SupabaseClient | null = null;

try {
  supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} catch (err) {
  console.warn('Supabase client initialized with fallback credentials:', err);
}

export const supabase = supabaseClient as SupabaseClient;

/**
 * Returns the active Supabase Auth access token if available,
 * or the demo admin token if running in demo/offline mode.
 */
export async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  try {
    if (supabase) {
      const { data } = await supabase.auth.getSession();
      if (data?.session?.access_token) {
        return data.session.access_token;
      }
    }
  } catch {
    // Continue to fallback
  }

  // Check demo session from localStorage
  const demoAuth = localStorage.getItem('nexora_admin_auth');
  if (demoAuth) {
    try {
      const parsed = JSON.parse(demoAuth);
      if (parsed.authenticated) {
        return 'demo_admin_jwt';
      }
    } catch {
      // ignore
    }
  }

  // In development mode, provide demo_admin_jwt so admin enquiries & sync queries succeed
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    return 'demo_admin_jwt';
  }

  return null;
}
