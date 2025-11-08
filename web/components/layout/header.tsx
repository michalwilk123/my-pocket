"use client";

import { useState } from "react";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Plus, UserRound } from "lucide-react";

import { LanguageSelector } from "./language-selector";

type HeaderProps = {
  onAddClick: () => void;
  onProfileClick: () => void;
  userAvatar: string | null;
  userName: string | null;
  locale: string;
};

export function Header({
  onAddClick,
  onProfileClick,
  userAvatar,
  userName,
  locale,
}: HeaderProps) {
  const t = useTranslations("header");
  const [failedAvatarUrl, setFailedAvatarUrl] = useState<string | null>(null);
  const avatarFailed = userAvatar === failedAvatarUrl;

  return (
    <header className="sticky top-0 z-30 bg-white shadow-sm border-b-2 border-primary">
      <div className="navbar mx-auto max-w-6xl py-2">
        <div className="navbar-start">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-error shadow-md">
              <span className="text-2xl font-bold text-white">mp</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-base-content">
                {t("title")}
              </span>
              <span className="text-xs font-medium text-primary">
                {t("tagline")}
              </span>
            </div>
          </div>
        </div>
        <div className="navbar-end gap-2">
          <LanguageSelector currentLocale={locale} />
          <button
            onClick={onAddClick}
            aria-label="Add new URL to collection"
            className="btn btn-primary gap-2 shadow-md hover:shadow-lg"
          >
            <Plus className="h-5 w-5" />
            <span className="hidden sm:inline">{t("addUrl")}</span>
          </button>
          <button
            onClick={onProfileClick}
            aria-label="Open profile menu"
            className="btn btn-circle btn-ghost hover:bg-primary/10"
          >
            {userAvatar && !avatarFailed ? (
              <div className="avatar">
                <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-white shadow-md">
                  <Image
                    src={userAvatar}
                    alt={userName || "User avatar"}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                    onError={() => setFailedAvatarUrl(userAvatar)}
                  />
                </div>
              </div>
            ) : (
              <UserRound className="h-6 w-6 text-primary" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
