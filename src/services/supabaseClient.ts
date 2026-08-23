/**
 * Supabase Client Configuration
 * Automatically loads Supabase URL and Anon Key from environment variables (Vite)
 * or localStorage runtime config.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const getEnvOrStorage = (key: string, storageKey: string): string => {
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && metaEnv[key]) {
      return metaEnv[key] as string;
    }
  } catch {
    // Fallback if import.meta.env is unavailable
  }
  return localStorage.getItem(storageKey) || '';
};

export const SUPABASE_URL = getEnvOrStorage('VITE_SUPABASE_URL', 'ls_supabase_url');
export const SUPABASE_ANON_KEY = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'ls_supabase_anon_key');

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('https://') &&
    !SUPABASE_URL.includes('your-project')
  );
};

export let supabase: SupabaseClient | null = null;

if (isSupabaseConfigured()) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  } catch (err) {
    console.error('[Supabase] Failed to initialize client:', err);
    supabase = null;
  }
}

/**
 * Configure Supabase credentials dynamically at runtime (via SaaS Admin Settings)
 */
export const configureSupabaseRuntime = (url: string, anonKey: string): boolean => {
  try {
    localStorage.setItem('ls_supabase_url', url.trim());
    localStorage.setItem('ls_supabase_anon_key', anonKey.trim());
    if (url.trim() && anonKey.trim()) {
      supabase = createClient(url.trim(), anonKey.trim());
      return true;
    }
    return false;
  } catch (err) {
    console.error('[Supabase] Failed to configure runtime credentials:', err);
    return false;
  }
};
