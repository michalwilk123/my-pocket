"use client";

import { useState } from "react";

import Image from "next/image";

import { ExternalLink, Globe } from "lucide-react";

import { Tag } from "@/lib/models";

import { TagGroup } from "../tags/tag-group";

type DemoLinkCardProps = {
  title: string;
  url: string;
  note: string;
  tags: Tag[];
};

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

export function DemoLinkCard(props: DemoLinkCardProps) {
  const [failedFaviconUrl, setFailedFaviconUrl] = useState<string>("");
  const domain = getDomainFromUrl(props.url);
  const faviconUrl = getFaviconUrl(props.url);
  const faviconFailed = faviconUrl === failedFaviconUrl;

  function handleCardClick() {
    window.open(props.url, "_blank", "noopener,noreferrer");
  }

  return (
    <article
      onClick={handleCardClick}
      className="card card-border group h-full cursor-pointer bg-white transition-all hover:-translate-y-0.5 hover:shadow-lg opacity-70"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-primary/60 transition-all group-hover:bg-primary/80"
      />
      <figure className="relative flex h-28 items-center justify-center overflow-hidden bg-gradient-to-br from-base-200 to-base-300">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md">
            {!faviconFailed && faviconUrl ? (
              <Image
                src={faviconUrl}
                alt={`${domain} favicon`}
                width={28}
                height={28}
                className="h-7 w-7"
                onError={() => setFailedFaviconUrl(faviconUrl)}
                unoptimized
              />
            ) : (
              <Globe className="h-7 w-7 text-primary" aria-hidden="true" />
            )}
          </div>
          <span className="text-xs font-medium text-base-content/60">
            {domain}
          </span>
        </div>
      </figure>
      <div className="card-body gap-2 p-3">
        <h2 className="card-title text-sm leading-tight break-all">{props.title}</h2>
        <div className="flex items-center gap-2 text-xs text-primary/70">
          <ExternalLink className="h-3 w-3" />
          <span className="truncate">{props.url}</span>
        </div>
        <p className="flex-1 text-sm text-base-content/70 break-all">
          {props.note}
        </p>
        {props.tags && props.tags.length > 0 && (
          <TagGroup tags={props.tags} maxRows={1} variant="primary" />
        )}
      </div>
    </article>
  );
}
