"use client";

import dynamic from "next/dynamic";

/**
 * Dynamically import the authenticated dashboard without SSR
 * This client component wrapper allows us to use `ssr: false`
 * which is not allowed in server components
 */
const AuthenticatedDashboard = dynamic(
  () =>
    import("./authenticated-dashboard").then((mod) => ({
      default: mod.AuthenticatedDashboard,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center bg-base-100 text-primary">
        <span
          className="loading loading-spinner loading-lg"
          aria-label="Loading dashboard"
        />
      </div>
    ),
  }
);

/**
 * Client wrapper that lazy-loads the authenticated dashboard
 * This component is only rendered for authenticated users
 */
export function AuthenticatedDashboardWrapper() {
  return <AuthenticatedDashboard />;
}

