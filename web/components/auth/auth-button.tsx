"use client";

import Image from "next/image";

import { Loadable } from "@/components/loadable";
import { useAuthStore } from "@/store";

export function AuthButton() {
  const user = useAuthStore((state) => state.user);
  const isLoading = useAuthStore((state) => state.isLoading);
  const signInWithGoogle = useAuthStore((state) => state.signInWithGoogle);
  const signOut = useAuthStore((state) => state.signOut);

  async function handleSignOut() {
    await signOut();
    window.location.href = "/";
  }

  return (
    <Loadable
      isLoading={isLoading}
      fallback={
        <div className="h-10 w-32 animate-pulse rounded-full bg-muted"></div>
      }
    >
      {user ? (
        <div className="flex items-center gap-3">
          {user.user_metadata?.avatar_url && (
            <Image
              src={user.user_metadata.avatar_url}
              alt={user.email ?? "User avatar"}
              width={32}
              height={32}
              className="h-8 w-8 rounded-full"
            />
          )}
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {user.user_metadata?.full_name || user.email}
            </span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
          <button
            onClick={handleSignOut}
            className="rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors hover:bg-muted"
          >
            Sign Out
          </button>
        </div>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Sign in with Google
        </button>
      )}
    </Loadable>
  );
}
