"use client";

import { useTransition } from "react";

type LanguageSelectorProps = {
  currentLocale: string;
};

export function LanguageSelector(props: LanguageSelectorProps) {
  const [isPending, startTransition] = useTransition();

  function handleChangeLocale(locale: string) {
    startTransition(async () => {
      document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000`;
      window.location.reload();
    });
  }

  return (
    <div className="dropdown dropdown-end">
      <button
        tabIndex={0}
        className="btn btn-ghost btn-circle"
        aria-label="Change language"
      >
        <span className="text-xl leading-none" aria-hidden="true">
          {props.currentLocale === "pl" ? "🇵🇱" : "🇬🇧"}
        </span>
      </button>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-[1] w-32 rounded-box bg-white p-2 shadow-lg border border-base-300 mt-3"
      >
        <li>
          <button
            onClick={() => handleChangeLocale("en")}
            className={`${props.currentLocale === "en" ? "active bg-primary/10" : ""}`}
            disabled={isPending}
          >
            English
          </button>
        </li>
        <li>
          <button
            onClick={() => handleChangeLocale("pl")}
            className={`${props.currentLocale === "pl" ? "active bg-primary/10" : ""}`}
            disabled={isPending}
          >
            Polski
          </button>
        </li>
      </ul>
    </div>
  );
}
