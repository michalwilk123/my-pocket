import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";

import { Database } from "./database.types";
import { getSupabaseUrl, getSupabaseAnonKey } from "./config";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(getSupabaseUrl(), getSupabaseAnonKey(), {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      },
    },
  });
}
