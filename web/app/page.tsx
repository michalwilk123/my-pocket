"use client";

import { useEffect, useState } from "react";

import {
  DemoLinkCard,
  Footer,
  Loadable,
  LoginModal,
  ToastContainer,
} from "@/components";
import {
  HeaderContainer,
  LinkGridContainer,
  PaginationContainer,
  SearchBarContainer,
} from "@/containers";
import { Modals, useModals } from "@/contexts/modals";
import { useAuthStore, useLinksStore, useTagsStore } from "@/store";

function AuthLoadingFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-base-100 text-primary">
      <span
        className="loading loading-spinner loading-lg"
        aria-label="Authenticating user"
      />
    </div>
  );
}

function UnauthenticatedLanding() {
  const demoLinks = [
    {
      id: "demo-1",
      title: "Next.js Documentation",
      url: "https://nextjs.org/docs",
      note: "Explore the official Next.js documentation to learn about features and API.",
      tags: [
        { id: "tag-1", label: "documentation" },
        { id: "tag-2", label: "react" },
      ],
    },
    {
      id: "demo-2",
      title: "Tailwind CSS",
      url: "https://tailwindcss.com",
      note: "A utility-first CSS framework for rapidly building custom designs.",
      tags: [
        { id: "tag-3", label: "css" },
        { id: "tag-4", label: "design" },
      ],
    },
    {
      id: "demo-3",
      title: "TypeScript Handbook",
      url: "https://www.typescriptlang.org/docs/handbook/intro.html",
      note: "Learn TypeScript from the ground up with the official handbook.",
      tags: [
        { id: "tag-5", label: "typescript" },
        { id: "tag-6", label: "documentation" },
      ],
    },
    {
      id: "demo-4",
      title: "MDN Web Docs",
      url: "https://developer.mozilla.org",
      note: "Resources for developers, by developers.",
      tags: [
        { id: "tag-7", label: "documentation" },
        { id: "tag-8", label: "reference" },
      ],
    },
    {
      id: "demo-5",
      title: "GitHub",
      url: "https://github.com",
      note: "Where the world builds software. Millions of developers collaborate here.",
      tags: [
        { id: "tag-9", label: "code" },
        { id: "tag-10", label: "tools" },
      ],
    },
    {
      id: "demo-6",
      title: "Stack Overflow",
      url: "https://stackoverflow.com",
      note: "The largest online community for programmers to learn and share knowledge.",
      tags: [
        { id: "tag-11", label: "community" },
        { id: "tag-12", label: "help" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-base-100 text-base-content">
      <HeaderContainer onAddClick={() => {}} onProfileClick={() => {}} />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {demoLinks.map((link) => (
            <DemoLinkCard
              key={link.id}
              title={link.title}
              url={link.url}
              note={link.note}
              tags={link.tags}
            />
          ))}
        </div>
      </main>
      <Footer />
      <LoginModal />
    </div>
  );
}

export default function Home() {
  const { showModal } = useModals();
  const user = useAuthStore((state) => state.user);
  const isAuthLoading = useAuthStore((state) => state.isLoading);
  const fetchLinks = useLinksStore((state) => state.fetchLinks);
  const fetchTags = useTagsStore((state) => state.fetchTags);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([fetchLinks(), fetchTags()]).finally(() => {
        setIsInitialLoad(false);
      });
    }
  }, [user]);

  function handleProfileClick() {
    showModal(Modals.UserProfile, {});
  }

  return (
    <Loadable isLoading={isAuthLoading} fallback={<AuthLoadingFallback />}>
      {!user ? (
        <UnauthenticatedLanding />
      ) : (
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
      )}
    </Loadable>
  );
}
