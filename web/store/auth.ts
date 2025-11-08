import { Session, User } from "@supabase/supabase-js";
import { createWithEqualityFn } from "zustand/traditional";

import { createClient } from "@/lib/supabase/client";
import {
  deleteAccount,
  getSession,
  signInWithGoogle,
  signOut,
} from "@/lib/utils/auth-helpers";

type AuthState = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  error: string | null;
};

type AuthActions = {
  initialize: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshSession: () => Promise<void>;
};

export const useAuthStore = createWithEqualityFn<AuthState & AuthActions>()(
  (set) => ({
    user: null,
    session: null,
    isLoading: true,
    error: null,

    initialize: async () => {
      try {
        set({ isLoading: true, error: null });
        const session = await getSession();
        const user = session?.user ?? null;
        set({ user, session, isLoading: false });

        const supabase = createClient();
        supabase.auth.onAuthStateChange((_event, session) => {
          set({ user: session?.user ?? null, session });
        });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Auth init failed";
        set({ error: errorMessage, isLoading: false });
      }
    },

    signInWithGoogle: async () => {
      try {
        console.log("[DEBUG] AuthStore: signInWithGoogle starting");
        set({ isLoading: true, error: null });
        await signInWithGoogle();
        console.log("[DEBUG] AuthStore: signInWithGoogle completed");
      } catch (error) {
        console.error("[DEBUG] AuthStore: signInWithGoogle error", error);
        const errorMessage =
          error instanceof Error ? error.message : "Sign in failed";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    signOut: async () => {
      try {
        set({ isLoading: true, error: null });
        await signOut();
        set({ user: null, session: null, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Sign out failed";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    deleteAccount: async () => {
      try {
        set({ isLoading: true, error: null });
        await deleteAccount();
        set({ user: null, session: null, isLoading: false });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Account deletion failed";
        set({ error: errorMessage, isLoading: false });
        throw error;
      }
    },

    refreshSession: async () => {
      try {
        const session = await getSession();
        const user = session?.user ?? null;
        set({ user, session });
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Session refresh failed";
        set({ error: errorMessage });
      }
    },
  })
);
