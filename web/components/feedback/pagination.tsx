"use client";

import { useTranslations } from "next-intl";

import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
};

export function Pagination(props: PaginationProps) {
  const t = useTranslations("pagination");

  // Calculate the range of items currently being displayed
  const startItem =
    props.totalResults === 0
      ? 0
      : (props.currentPage - 1) * props.itemsPerPage + 1;
  const endItem = Math.min(
    props.currentPage * props.itemsPerPage,
    props.totalResults
  );

  if (props.totalPages <= 1) {
    // Still show the results count even if there's only one page
    if (props.totalResults === 0) return null;

    return (
      <div className="flex justify-center py-8">
        <p className="text-xs text-base-content/50">
          {t("showing")}{" "}
          <span className="font-medium text-base-content/70">
            {startItem}-{endItem}
          </span>{" "}
          {t("of")}{" "}
          <span className="font-medium text-base-content/70">
            {props.totalResults}
          </span>{" "}
          {t("results")}
        </p>
      </div>
    );
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 7;

    if (props.totalPages <= maxVisible) {
      for (let i = 1; i <= props.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (props.currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, props.currentPage - 1);
      const end = Math.min(props.totalPages - 1, props.currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (props.currentPage < props.totalPages - 2) {
        pages.push("...");
      }

      pages.push(props.totalPages);
    }

    return pages;
  };

  return (
    <nav
      className="flex flex-col items-center gap-2 py-8"
      aria-label="Pagination"
    >
      <div className="flex items-center gap-1 rounded-full border border-base-200/80 bg-base-100/80 px-2 py-2 shadow-sm backdrop-blur">
        <button
          onClick={() => props.onPageChange(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            props.currentPage === 1
              ? "cursor-not-allowed text-base-content/30"
              : "text-base-content/70 hover:bg-base-200"
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {getPageNumbers().map((page, index) => {
          if (page === "...") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="mx-1 h-9 w-9 select-none text-center leading-9 text-base-content/40"
                aria-hidden="true"
              >
                ...
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = props.currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => props.onPageChange(pageNum)}
              className={`inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full px-3 text-sm font-semibold transition-all ${
                isActive
                  ? "bg-primary text-primary-content shadow"
                  : "text-base-content/70 hover:bg-base-200"
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => props.onPageChange(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
          className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
            props.currentPage === props.totalPages
              ? "cursor-not-allowed text-base-content/30"
              : "text-base-content/70 hover:bg-base-200"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-base-content/50">
        {t("showing")}{" "}
        <span className="font-medium text-base-content/70">
          {startItem}-{endItem}
        </span>{" "}
        {t("of")}{" "}
        <span className="font-medium text-base-content/70">
          {props.totalResults}
        </span>{" "}
        {t("results")}
      </p>
    </nav>
  );
}
