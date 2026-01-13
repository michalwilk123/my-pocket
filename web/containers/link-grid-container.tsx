"use client";

import { useCallback } from "react";

import { useRouter, useSearchParams } from "next/navigation";

import { shallow } from "zustand/shallow";

import { LinkGrid, Loadable } from "@/components";
import { Modals, useModals } from "@/contexts/modals";
import { useLinksStore, useSearchStore } from "@/store";

type LinkGridContainerProps = {
  isInitialLoad: boolean;
};

export function LinkGridContainer({ isInitialLoad }: LinkGridContainerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const pageFromUrl = pageParam ? parseInt(pageParam, 10) : 1;

  const { links } = useLinksStore(
    (state) => ({
      links: state.links,
    }),
    shallow
  );
  const { showModal } = useModals();
  const { getPagination, toggleTag, sortOrder } = useSearchStore(
    (state) => ({
      getPagination: state.getPagination,
      toggleTag: state.toggleTag,
      sortOrder: state.sortOrder,
    }),
    shallow
  );

  const { paginatedLinks } = getPagination(links, query, pageFromUrl);

  const handleEditClick = useCallback(
    (id: string) => {
      showModal(Modals.EditLink, { linkId: id });
    },
    [showModal]
  );

  const handleDeleteClick = useCallback(
    (id: string) => {
      showModal(Modals.ConfirmDelete, { linkId: id });
    },
    [showModal]
  );

  const handleAddClick = useCallback(() => {
    showModal(Modals.AddLink, {});
  }, [showModal]);

  const handleTagClick = useCallback(
    (tagId: string) => {
      toggleTag(tagId);
      const params = new URLSearchParams(searchParams.toString());
      params.delete("page");
      const queryString = params.toString();
      router.push(queryString ? `?${queryString}` : "/", { scroll: false });
    },
    [toggleTag, router, searchParams]
  );

  return (
    <Loadable
      isLoading={isInitialLoad}
      fallback={
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="skeleton h-56 w-full rounded-box" />
          ))}
        </div>
      }
    >
      <LinkGrid
        links={paginatedLinks}
        onEdit={handleEditClick}
        onDelete={handleDeleteClick}
        onAddClick={handleAddClick}
        onTagClick={handleTagClick}
        sortOrder={sortOrder}
      />
    </Loadable>
  );
}
