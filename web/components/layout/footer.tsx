"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="relative mt-8 bg-gradient-to-b from-base-200/50 to-base-200 py-8 text-xs text-base-content/60">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-8 bg-gradient-to-b from-primary/5 to-transparent"
      />
      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="text-base-content/50">
            © {new Date().getFullYear()} {t("copyright")}
          </span>
          <a
            href="/privacy"
            className="font-medium text-primary/70 transition-colors duration-200 hover:text-primary"
          >
            Privacy Policy
          </a>
        </div>
        <span className="text-base-content/50">
          Made in Poland 🇵🇱 by{" "}
          <a
            href="https://micwilk.com/about/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary/70 transition-colors duration-200 hover:text-primary"
          >
            Michał Wilk
          </a>
        </span>
      </div>
    </footer>
  );
}
