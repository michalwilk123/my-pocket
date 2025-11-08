"use client";

import { useTranslations } from "next-intl";

import { ArrowDownUp, Search } from "lucide-react";

import { TagChip } from "@/components/tags/tag-chip";
import { Tag } from "@/lib/models";
import { SORT_OPTIONS, type SortOption } from "@/store/search";

type SearchBarProps = {
  searchQuery: string;
  selectedTags: string[];
  availableTags: Tag[];
  sortOrder: SortOption;
  onSearchChange: (query: string) => void;
  onTagToggle: (tagId: string) => void;
  onSortChange: (order: SortOption) => void;
  onSearchSubmit: () => void;
};

export function SearchBar(props: SearchBarProps) {
  const t = useTranslations("search");

  const sortOptionLabels: Record<SortOption, string> = {
    newest: t("sort.options.newest"),
    oldest: t("sort.options.oldest"),
    "title-asc": t("sort.options.titleAsc"),
    "title-desc": t("sort.options.titleDesc"),
  };

  function isTagSelected(tagId: string): boolean {
    return props.selectedTags.includes(tagId);
  }

  return (
    <div className="w-full space-y-3">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          props.onSearchSubmit();
        }}
      >
        <label className="input input-bordered h-12 pl-5 p-2 flex w-full items-center gap-2 bg-white shadow-sm">
          <input
            type="search"
            placeholder={t("placeholder")}
            aria-label="Search saved links"
            value={props.searchQuery}
            onChange={(e) => {
              const newValue = e.target.value;
              props.onSearchChange(newValue);
              if (newValue === "") {
                props.onSearchSubmit();
              }
            }}
            className="grow"
          />
          {props.selectedTags.length > 0 && (
            <span className="badge badge-primary badge-sm">
              {props.selectedTags.length}
            </span>
          )}
          <button
            type="submit"
            className="btn btn-primary btn-sm"
            aria-label="Search"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
          </button>
        </label>
      </form>

      <div className="flex flex-col gap-2.5 rounded-lg border border-base-300/70 bg-base-200/40 p-2.5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {props.availableTags.length > 0 ? (
          <div className="flex flex-1 items-center gap-2 overflow-x-auto">
            {props.availableTags.map((tag) => (
              <button
                key={tag.id}
                onClick={() => props.onTagToggle(tag.id)}
                className="shrink-0"
              >
                <TagChip
                  id={tag.id}
                  label={tag.label}
                  variant={isTagSelected(tag.id) ? "primary" : "default"}
                />
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="w-[2px] bg-base-content/30 h-6" />

        <div className="flex items-center gap-1.5">
          <div className="inline-flex items-center gap-1 text-xs font-medium text-base-content/60">
            <ArrowDownUp className="h-3 w-3" aria-hidden="true" />
            <span className="hidden sm:inline">{t("sort.label")}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {SORT_OPTIONS.map((option) => {
              const isActive = option === props.sortOrder;
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => props.onSortChange(option)}
                  className={`rounded-full px-2 py-0.5 text-[11px] font-semibold transition-all duration-200 sm:px-2.5 sm:py-1 sm:text-xs ${
                    isActive
                      ? "bg-primary text-primary-content shadow-md"
                      : "bg-base-100 text-base-content/70 hover:bg-base-300/70 hover:shadow-sm"
                  }`}
                  aria-pressed={isActive}
                >
                  {sortOptionLabels[option]}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
