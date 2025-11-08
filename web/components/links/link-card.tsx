"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";
import Image from "next/image";

import { Copy, Edit3, Globe, Trash2 } from "lucide-react";

import { Link } from "@/lib/models";
import { useToastStore } from "@/store";

import { TagGroup } from "../tags/tag-group";

type LinkCardProps = Link & {
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onTagClick?: (id: string) => void;
};

function formatUrl(url: string): string {
  if (url.length <= 48) {
    return url;
  }
  return `${url.slice(0, 45)}...`;
}

export function LinkCard(props: LinkCardProps) {
  const t = useTranslations("linkCard");
  const showToast = useToastStore((state) => state.showToast);
  const [failedFaviconUrl, setFailedFaviconUrl] = useState<string>("");
  const domain = getDomainFromUrl(props.url);
  const faviconUrl = getFaviconUrl(props.url);
  const faviconFailed = faviconUrl === failedFaviconUrl;

  function handleCopyClick(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    navigator.clipboard.writeText(props.url);
    showToast(t("copyUrl"));
  }

  function handleCardClick() {
    window.open(props.url, "_blank", "noopener,noreferrer");
  }

  function handleTagClick(id: string) {
    if (props.onTagClick) {
      props.onTagClick(id);
    }
  }

  function getDomainFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.hostname;
    } catch {
      return url;
    }
  }

  function getFaviconUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return `https://www.google.com/s2/favicons?domain=${urlObj.hostname}&sz=128`;
    } catch {
      return "";
    }
  }

  return (
    <article
      onClick={handleCardClick}
      className="card card-border group h-full cursor-pointer bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary/60 transition-all group-hover:bg-primary/80"
      />
      <figure className="relative flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-md">
            {!faviconFailed && faviconUrl ? (
              <Image
                src={faviconUrl}
                alt={`${domain} favicon`}
                width={40}
                height={40}
                className="h-10 w-10"
                onError={() => setFailedFaviconUrl(faviconUrl)}
                unoptimized
              />
            ) : (
              <Globe className="h-10 w-10 text-primary" aria-hidden="true" />
            )}
          </div>
          <span className="text-sm font-medium text-base-content/60">
            {domain}
          </span>
        </div>
      </figure>
      <div className="card-body gap-2.5">
        <h2 className="card-title text-base break-all">{props.title}</h2>
        <button
          onClick={handleCopyClick}
          aria-label={t("copyUrl")}
          className="btn btn-primary btn-xs w-fit gap-1"
        >
          <Copy className="h-3 w-3" />
          <span className="truncate max-w-[200px]" title={props.url}>
            {formatUrl(props.url)}
          </span>
        </button>
        <p className="flex-1 text-sm text-base-content/70 break-all">
          {props.note}
        </p>
        {props.tags && props.tags.length > 0 ? (
          <TagGroup
            tags={props.tags}
            maxRows={1}
            variant="primary"
            onTagClick={handleTagClick}
          />
        ) : (
          <div className="text-xs text-base-content/40">{t("noTags")}</div>
        )}
      </div>
      <div className="card-actions justify-stretch border-t border-neutral/20 p-4 pt-2">
        <ActionButton
          label={t("editLabel")}
          onClick={(e) => {
            e.stopPropagation();
            props.onEdit(props.id);
          }}
          variant="secondary"
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>{t("edit")}</span>
        </ActionButton>
        <ActionButton
          label={t("deleteLabel")}
          onClick={(e) => {
            e.stopPropagation();
            props.onDelete(props.id);
          }}
          variant="destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t("delete")}</span>
        </ActionButton>
      </div>
    </article>
  );
}

type ActionButtonProps = {
  label: string;
  children: React.ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant: "secondary" | "destructive";
};

function ActionButton(props: ActionButtonProps) {
  const classes =
    props.variant === "destructive"
      ? "btn btn-outline btn-error btn-xs flex-1 gap-1.5"
      : "btn btn-outline btn-xs flex-1 gap-1.5 hover:btn-primary";

  return (
    <button
      aria-label={props.label}
      onClick={props.onClick}
      className={classes}
    >
      {props.children}
    </button>
  );
}
