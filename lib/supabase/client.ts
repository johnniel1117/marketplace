// lib/supabase/client.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

declare global {
  interface Window {
    supabase: any; // Use 'any' to avoid type mismatch error
  }
}

export const createClient = () => {
  const client = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  if (typeof window !== 'undefined') {
    window.supabase = client; // Expose globally for debugging in browser
  }
  return client;
}