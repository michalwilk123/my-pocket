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
      className="flex flex-col items-center gap-3 py-6"
      aria-label="Pagination"
    >
      <div className="relative flex items-center gap-1 rounded-full border border-base-300 bg-gradient-to-b from-base-100 to-base-200/50 px-3 py-2 shadow-md">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -bottom-px mx-auto h-px w-1/2 bg-gradient-to-r from-transparent via-primary/30 to-transparent"
        />
        <button
          onClick={() => props.onPageChange(props.currentPage - 1)}
          disabled={props.currentPage === 1}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            props.currentPage === 1
              ? "cursor-not-allowed text-base-content/25"
              : "text-base-content/60 hover:bg-primary/10 hover:text-primary"
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
                className="mx-0.5 h-8 w-8 select-none text-center leading-8 text-base-content/35"
                aria-hidden="true"
              >
                ···
              </span>
            );
          }

          const pageNum = page as number;
          const isActive = props.currentPage === pageNum;
          return (
            <button
              key={pageNum}
              onClick={() => props.onPageChange(pageNum)}
              className={`relative inline-flex h-8 min-w-[2rem] items-center justify-center rounded-full px-2.5 text-sm font-semibold transition-all duration-200 ${
                isActive
                  ? "bg-primary text-primary-content shadow-lg shadow-primary/25 scale-105"
                  : "text-base-content/60 hover:bg-primary/10 hover:text-primary hover:scale-105"
              }`}
              aria-label={`Page ${pageNum}`}
              aria-current={isActive ? "page" : undefined}
            >
              {pageNum}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                />
              )}
            </button>
          );
        })}

        <button
          onClick={() => props.onPageChange(props.currentPage + 1)}
          disabled={props.currentPage === props.totalPages}
          className={`inline-flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 ${
            props.currentPage === props.totalPages
              ? "cursor-not-allowed text-base-content/25"
              : "text-base-content/60 hover:bg-primary/10 hover:text-primary"
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <p className="text-xs text-base-content/45">
        {t("showing")}{" "}
        <span className="font-semibold text-base-content/65">
          {startItem}-{endItem}
        </span>{" "}
        {t("of")}{" "}
        <span className="font-semibold text-base-content/65">
          {props.totalResults}
        </span>{" "}
        {t("results")}
      </p>
    </nav>
  );
}
