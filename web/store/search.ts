import { createWithEqualityFn } from "zustand/traditional";

import { Link } from "@/lib/models";

const DEFAULT_LINKS_PER_PAGE = 12;

export const SORT_OPTIONS = [
  "newest",
  "oldest",
  "title-asc",
  "title-desc",
] as const;

export type SortOption = (typeof SORT_OPTIONS)[number];

const DEFAULT_SORT_OPTION: SortOption = "newest";

type SearchState = {
  selectedTags: string[];
  currentPage: number;
  linksPerPage: number;
  sortOrder: SortOption;
  toggleTag: (tagId: string) => void;
  setCurrentPage: (page: number) => void;
  setSortOrder: (order: SortOption) => void;
  reset: () => void;
  getPagination: (
    links: Link[],
    query: string,
    pageFromUrl?: number
  ) => {
    filteredLinks: Link[];
    paginatedLinks: Link[];
    totalPages: number;
    currentPage: number;
    totalResults: number;
    itemsPerPage: number;
  };
};

export const useSearchStore = createWithEqualityFn<SearchState>()(
  (set, get) => ({
    selectedTags: [],
    currentPage: 1,
    linksPerPage: DEFAULT_LINKS_PER_PAGE,
    sortOrder: DEFAULT_SORT_OPTION,

    toggleTag: (tagId) =>
      set((state) => {
        const isSelected = state.selectedTags.includes(tagId);
        const selectedTags = isSelected
          ? state.selectedTags.filter((id) => id !== tagId)
          : [...state.selectedTags, tagId];

        return {
          selectedTags,
          currentPage: 1,
        };
      }),

    setCurrentPage: (page) =>
      set(() => {
        const numericPage = Number.isFinite(page) ? Math.floor(page) : 1;
        return {
          currentPage: Math.max(1, numericPage),
        };
      }),

    setSortOrder: (order) =>
      set((state) => {
        if (state.sortOrder === order) {
          return {};
        }

        return {
          sortOrder: order,
          currentPage: 1,
        };
      }),

    reset: () =>
      set({
        selectedTags: [],
        currentPage: 1,
        sortOrder: DEFAULT_SORT_OPTION,
      }),

    getPagination: (links, query, pageFromUrl) => {
      const { selectedTags, linksPerPage, sortOrder, currentPage } = get();
      const normalizedQuery = query.trim().toLowerCase();

      const filteredLinks = links.filter((link) => {
        const matchesQuery =
          normalizedQuery.length === 0 ||
          link.title.toLowerCase().includes(normalizedQuery) ||
          link.url.toLowerCase().includes(normalizedQuery);

        const matchesTags =
          selectedTags.length === 0 ||
          link.tags.some((tag) => selectedTags.includes(tag.id));

        return matchesQuery && matchesTags;
      });

      const sortedLinks = sortLinks(filteredLinks, sortOrder);

      const totalPages = Math.max(
        1,
        Math.ceil(sortedLinks.length / linksPerPage)
      );
      const sourcePage = Number.isFinite(pageFromUrl)
        ? Number(pageFromUrl)
        : currentPage;
      const normalizedPage = Number.isFinite(sourcePage)
        ? Math.floor(sourcePage)
        : 1;
      const safePage = Math.min(Math.max(1, normalizedPage), totalPages);
      const startIndex = (safePage - 1) * linksPerPage;

      const paginatedLinks = sortedLinks.slice(
        startIndex,
        startIndex + linksPerPage
      );

      return {
        filteredLinks: sortedLinks,
        paginatedLinks,
        totalPages,
        currentPage: safePage,
        totalResults: sortedLinks.length,
        itemsPerPage: linksPerPage,
      };
    },
  })
);

function sortLinks(links: Link[], sortOrder: SortOption): Link[] {
  if (links.length === 0) {
    return links;
  }

  const sorted = [...links];

  const getTimestamp = (value: string | undefined): number => {
    if (!value) {
      return 0;
    }

    const timestamp = Date.parse(value);
    return Number.isNaN(timestamp) ? 0 : timestamp;
  };

  const compareByTitle = (a: Link, b: Link) =>
    a.title.localeCompare(b.title, undefined, { sensitivity: "base" });

  switch (sortOrder) {
    case "oldest":
      return sorted.sort(
        (a, b) => getTimestamp(a.createdAt) - getTimestamp(b.createdAt)
      );
    case "title-asc":
      return sorted.sort(compareByTitle);
    case "title-desc":
      return sorted.sort((a, b) => compareByTitle(b, a));
    case "newest":
    default:
      return sorted.sort(
        (a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt)
      );
  }
}
