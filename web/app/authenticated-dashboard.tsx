"use client";

import { useEffect, useState } from "react";

import { Footer, ToastContainer } from "@/components";
import {
  HeaderContainer,
  LinkGridContainer,
  PaginationContainer,
  SearchBarContainer,
} from "@/containers";
import { Modals, useModals } from "@/contexts/modals";
import { useAuthStore, useLinksStore, useTagsStore } from "@/store";

/**
 * Client component for the authenticated dashboard
 * This is dynamically imported only for authenticated users
 * to keep the main page server-rendered for SEO
 */
export function AuthenticatedDashboard() {
  const { showModal } = useModals();
  const user = useAuthStore((state) => state.user);
  const fetchLinks = useLinksStore((state) => state.fetchLinks);
  const fetchTags = useTagsStore((state) => state.fetchTags);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([fetchLinks(), fetchTags()]).finally(() => {
        setIsInitialLoad(false);
      });
    }
  }, [user, fetchLinks, fetchTags]);

  function handleProfileClick() {
    showModal(Modals.UserProfile, {});
  }

  return (
    <div className="flex min-h-screen flex-col bg-base-100 text-base-content">
      <HeaderContainer
        onAddClick={() => showModal(Modals.AddLink, {})}
        onProfileClick={handleProfileClick}
      />

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6">
        <SearchBarContainer />

        <LinkGridContainer isInitialLoad={isInitialLoad} />

        <PaginationContainer />
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}

