import { getServerUser } from "@/lib/utils/auth-server";
import { UnauthenticatedLanding } from "./unauthenticated-landing";
import { AuthenticatedDashboardWrapper } from "./authenticated-dashboard-wrapper";

/**
 * Main page component - now a server component!
 * 
 * SEO Benefits:
 * - Server-rendered HTML for unauthenticated users
 * - No client-side auth loading spinner for crawlers
 * - Full content available on initial page load
 * - Authenticated experience only hydrates for logged-in users
 */
export default async function Home() {
  // Check authentication on the server using cookies
  const user = await getServerUser();

  // For unauthenticated users, return the static landing page
  // This is fully server-rendered and crawlable by search engines
  if (!user) {
    return <UnauthenticatedLanding />;
  }

  // For authenticated users, load the dashboard dynamically
  // This keeps the client bundle separate and doesn't block SEO
  return <AuthenticatedDashboardWrapper />;
}
