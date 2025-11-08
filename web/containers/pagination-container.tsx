"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { shallow } from "zustand/shallow";

import { Pagination } from "@/components";
import { useLinksStore, useSearchStore } from "@/store";

export function PaginationContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

  const links = useLinksStore((state) => state.links);
  const { getPagination } = useSearchStore(
    (state) => ({
      getPagination: state.getPagination,
    }),
    shallow
  );

  const { totalPages, currentPage, totalResults, itemsPerPage } = getPagination(
    links,
    query,
    pageFromUrl
  );

  function handlePageChange(page: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (page === 1) {
      params.delete("page");
    } else {
      params.set("page", page.toString());
    }
    const queryString = params.toString();
    router.push(queryString ? `?${queryString}` : "/", { scroll: false });
  }

  return (
    <Pagination
      currentPage={currentPage}
      totalPages={totalPages}
      totalResults={totalResults}
      itemsPerPage={itemsPerPage}
      onPageChange={handlePageChange}
    />
  );
}
