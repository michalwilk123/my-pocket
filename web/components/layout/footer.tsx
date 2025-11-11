"use client";

import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations("footer");

  return (
    <footer className="footer footer-center border-t border-primary/20 bg-base-100 p-6 text-xs text-base-content/60">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <span>
          © {new Date().getFullYear()} {t("copyright")}
        </span>
        <span>
          Made in Poland 🇵🇱 by{" "}
          <a
            href="https://micwilk.com/about/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary/80 hover:text-primary"
          >
            Michał Wilk
          </a>
        </span>
      </div>
    </footer>
  );
}
