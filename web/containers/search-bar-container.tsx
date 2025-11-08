"use client";

import { useCallback, useEffect, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { shallow } from "zustand/shallow";

import { SearchBar } from "@/components";
import { useLinksStore, useSearchStore, useTagsStore } from "@/store";
import { SORT_OPTIONS, type SortOption } from "@/store/search";

const DEFAULT_SORT_OPTION: SortOption = SORT_OPTIONS[0];

function isSortOption(value: string | null): value is SortOption {
  return value ? (SORT_OPTIONS as readonly string[]).includes(value) : false;
}

export function SearchBarContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { selectedTags, toggleTag, sortOrder, setSortOrder } = useSearchStore(
    (state) => ({
      selectedTags: state.selectedTags,
      toggleTag: state.toggleTag,
      sortOrder: state.sortOrder,
      setSortOrder: state.setSortOrder,
    }),
    shallow
  );

  const availableTags = useTagsStore((state) => state.tags);
  const searchLinks = useLinksStore((state) => state.searchLinks);

  const [inputValue, setInputValue] = useState(query);
  useEffect(() => {
    setInputValue(query);
  }, [query]);

  useEffect(() => {
    searchLinks(query, selectedTags);
  }, [query, selectedTags, searchLinks]);

  function handleSearchChange(newQuery: string) {
    setInputValue(newQuery);
  }

  useEffect(() => {
    const rawSort = searchParams.get("sort");
    const nextSort = isSortOption(rawSort) ? rawSort : DEFAULT_SORT_OPTION;
    setSortOrder(nextSort);
  }, [searchParams, setSortOrder]);

  const handleSortChange = useCallback(
    (order: SortOption) => {
      setSortOrder(order);
      const params = new URLSearchParams(searchParams.toString());
      if (order === DEFAULT_SORT_OPTION) {
        params.delete("sort");
      } else {
        params.set("sort", order);
      }
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "/", { scroll: false });
    },
    [router, searchParams, setSortOrder]
  );

  const handleSearchSubmit = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const next = inputValue.trim();
    if (next) {
      params.set("q", next);
    } else {
      params.delete("q");
    }
    params.delete("page");
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/", { scroll: false });
  }, [router, searchParams, inputValue]);

  return (
    <SearchBar
      searchQuery={inputValue}
      selectedTags={selectedTags}
      availableTags={availableTags}
      sortOrder={sortOrder}
      onSearchChange={handleSearchChange}
      onTagToggle={toggleTag}
      onSortChange={handleSortChange}
      onSearchSubmit={handleSearchSubmit}
    />
  );
}
