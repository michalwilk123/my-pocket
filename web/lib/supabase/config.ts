import { Database } from "./database.types";

// Next.js inlines NEXT_PUBLIC_* env vars at build time
// We must reference them directly, not dynamically via process.env[key]
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export function getSupabaseUrl(): string {
  if (!SUPABASE_URL) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL not set");
  }
  return SUPABASE_URL;
}

export function getSupabaseAnonKey(): string {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY not set");
  }
  return SUPABASE_ANON_KEY;
}

export type SupabaseClient = ReturnType<typeof import("@supabase/ssr").createBrowserClient<Database>>;

