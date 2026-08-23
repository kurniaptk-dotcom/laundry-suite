/**
 * Supabase Client Configuration
 * Automatically loads Supabase URL and Anon Key from environment variables (Vite)
 * or configured defaults.
 */

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const DEFAULT_SUPABASE_URL = 'https://pxcxwendicswsfbjgwdv.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB4Y3h3ZW5kaWNzd3NmYmpnd2R2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc0NzAyMTcsImV4cCI6MjEwMzA0NjIxN30.ZkCLbLvIWndTbAvg8iJvhN0ni491ZquEeQGoxMitkjI';

const getEnvOrStorage = (key: string, storageKey: string, fallback: string): string => {
  try {
    const metaEnv = (import.meta as any)?.env;
    if (metaEnv && metaEnv[key] && !metaEnv[key].includes('your-project')) {
      return metaEnv[key] as string;
    }
  } catch {
    // Fallback
  }
  const fromStorage = localStorage.getItem(storageKey);
  if (fromStorage) return fromStorage;
  return fallback;
};

export const SUPABASE_URL = getEnvOrStorage('VITE_SUPABASE_URL', 'ls_supabase_url', DEFAULT_SUPABASE_URL);
export const SUPABASE_ANON_KEY = getEnvOrStorage('VITE_SUPABASE_ANON_KEY', 'ls_supabase_anon_key', DEFAULT_SUPABASE_ANON_KEY);

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('https://')
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
