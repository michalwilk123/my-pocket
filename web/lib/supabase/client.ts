import { createBrowserClient } from "@supabase/ssr";

import { Database } from "./database.types";
import { getSupabaseUrl, getSupabaseAnonKey } from "./config";

export function createClient() {
  return createBrowserClient<Database>(getSupabaseUrl(), getSupabaseAnonKey());
}
