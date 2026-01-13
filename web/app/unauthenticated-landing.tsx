"use client";

import { useLocale } from "next-intl";

import { DemoLinkCard, Footer, Header, LoginModal } from "@/components";

/**
 * Landing page for unauthenticated users
 * Shows demo content and login modal
 */
export function UnauthenticatedLanding() {
  const locale = useLocale();
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
    {
      id: "demo-7",
      title: "Vercel Platform",
      url: "https://vercel.com",
      note: "Deploy web projects with the best frontend developer experience.",
      tags: [
        { id: "tag-13", label: "hosting" },
        { id: "tag-14", label: "deployment" },
      ],
    },
    {
      id: "demo-8",
      title: "React Documentation",
      url: "https://react.dev",
      note: "The library for web and native user interfaces.",
      tags: [
        { id: "tag-15", label: "react" },
        { id: "tag-16", label: "documentation" },
      ],
    },
    {
      id: "demo-9",
      title: "Supabase",
      url: "https://supabase.com",
      note: "Open source Firebase alternative with Postgres database.",
      tags: [
        { id: "tag-17", label: "database" },
        { id: "tag-18", label: "backend" },
      ],
    },
    {
      id: "demo-10",
      title: "Prisma ORM",
      url: "https://www.prisma.io",
      note: "Next-generation Node.js and TypeScript ORM for databases.",
      tags: [
        { id: "tag-19", label: "database" },
        { id: "tag-20", label: "typescript" },
      ],
    },
    {
      id: "demo-11",
      title: "Figma",
      url: "https://www.figma.com",
      note: "Collaborative interface design tool for teams.",
      tags: [
        { id: "tag-21", label: "design" },
        { id: "tag-22", label: "tools" },
      ],
    },
    {
      id: "demo-12",
      title: "Linear",
      url: "https://linear.app",
      note: "Streamline issues, projects, and product roadmaps.",
      tags: [
        { id: "tag-23", label: "productivity" },
        { id: "tag-24", label: "tools" },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-base-100 text-base-content">
      <Header
        onAddClick={() => {}}
        onProfileClick={() => {}}
        userAvatar={null}
        userName={null}
        locale={locale}
      />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-6 py-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
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

