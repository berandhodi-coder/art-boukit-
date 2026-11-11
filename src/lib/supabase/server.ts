import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client initialization.
 * Reads NEXT_PUBLIC_SUPABASE_URL and server-only SUPABASE_SERVICE_ROLE_KEY.
 * Returns null if Supabase is not configured in the environment.
 */
export function getSupabaseServerClient(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  // Prefer server-only service role key for administrative inserts bypassing RLS;
  // fallback to anon key if service role is not set
  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  // Validate URL format
  try {
    new URL(supabaseUrl);
  } catch {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseServerClient() !== null;
}
