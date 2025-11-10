import { createClient } from "../supabase/server";

/**
 * Server-side utility to get the current authenticated user
 * This uses the Next.js cookies() API to read authentication state
 * without requiring client-side JavaScript
 */
export async function getServerUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("[SERVER AUTH] Error fetching user:", error);
      return null;
    }

    return user;
  } catch (error) {
    console.error("[SERVER AUTH] Unexpected error:", error);
    return null;
  }
}

/**
 * Server-side utility to get the current session
 */
export async function getServerSession() {
  try {
    const supabase = await createClient();
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();

    if (error) {
      console.error("[SERVER AUTH] Error fetching session:", error);
      return null;
    }

    return session;
  } catch (error) {
    console.error("[SERVER AUTH] Unexpected error:", error);
    return null;
  }
}

