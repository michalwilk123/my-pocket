"use client";

import { useTranslations } from "next-intl";

import { Plus } from "lucide-react";

import { Link } from "@/lib/models";
import { type SortOption } from "@/store/search";

import { LinkCard } from "./link-card";

type LinkGridProps = {
  links: Link[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onAddClick: () => void;
  onTagClick?: (id: string) => void;
  sortOrder: SortOption;
};

export function LinkGrid(props: LinkGridProps) {
  const emptyStateTranslations = useTranslations("emptyState");

  if (props.links.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-4 rounded-box border border-dashed border-neutral/30 bg-base-200/20 py-16">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-dashed border-primary/30 bg-primary/5">
            <Plus className="h-8 w-8 text-primary/50" />
          </div>
          <h3 className="text-lg font-semibold">
            {emptyStateTranslations("heading")}
          </h3>
          <p className="max-w-sm text-sm text-base-content/60">
            {emptyStateTranslations("description")}
          </p>
        </div>
        <button
          onClick={props.onAddClick}
          aria-label="Add your first link"
          className="btn btn-primary gap-2"
        >
          <Plus className="h-4 w-4" />
          {emptyStateTranslations("addFirstLink")}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <section
        className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        data-sort-order={props.sortOrder}
      >
        {props.links.map((item) => (
          <LinkCard
            key={item.id}
            id={item.id}
            title={item.title}
            url={item.url}
            note={item.note}
            tags={item.tags}
            image={item.image}
            createdAt={item.createdAt}
            onEdit={props.onEdit}
            onDelete={props.onDelete}
            onTagClick={props.onTagClick}
          />
        ))}
      </section>
    </div>
  );
}
