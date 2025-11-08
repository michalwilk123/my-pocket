import { createClient } from "@supabase/supabase-js";

import { Database } from "./database.types";
import { getSupabaseUrl, getSupabaseAnonKey } from "./config";

export function createClientWithAuth(authHeader: string) {
  return createClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    global: {
      headers: {
        Authorization: authHeader,
      },
    },
  });
}
