import { createWithEqualityFn } from "zustand/traditional";

import * as actions from "@/actions/links";
import { Link } from "@/lib/models";

type AddLinkParams = {
  title: string;
  url: string;
  note: string;
  tagIds: string[];
  image: string;
};

type UpdateLinkParams = {
  title: string;
  url: string;
  note: string;
  image: string;
};

type LinksState = {
  links: Link[];
  isLoading: boolean;
  isSearching: boolean;
  error: string | null;
  fetchLinks: () => Promise<void>;
  searchLinks: (query: string, tagIds: string[]) => Promise<void>;
  addLink: (params: AddLinkParams) => Promise<Link | undefined>;
  removeLink: (id: string) => Promise<void>;
  updateLink: (id: string, params: UpdateLinkParams) => Promise<void>;
  addTagToLink: (linkId: string, tagId: string) => Promise<void>;
  removeTagFromLink: (linkId: string, tagId: string) => Promise<void>;
  getLinkById: (id: string) => Link | undefined;
  getLinksByTagId: (tagId: string) => Link[];
  exportLinks: () => Promise<string>;
  importLinks: (csvContent: string) => Promise<number>;
};

export const useLinksStore = createWithEqualityFn<LinksState>()((set, get) => ({
  links: [],
  isLoading: false,
  isSearching: false,
  error: null,

  fetchLinks: async () => {
    set({ isLoading: true, error: null });
    try {
      const links = await actions.fetchLinks();
      set({ links, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch links";
      set({ error: errorMessage, isLoading: false });
    }
  },

  searchLinks: async (query: string, tagIds: string[]) => {
    set({ isSearching: true, error: null });
    try {
      const links = await actions.searchLinks(query, tagIds);
      set({ links, isSearching: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to search links";
      set({ error: errorMessage, isSearching: false });
    }
  },

  addLink: async (params: AddLinkParams) => {
    if (!params.url.trim()) return undefined;

    set({ isLoading: true, error: null });
    try {
      const newLink = await actions.createLink(
        params.title,
        params.url,
        params.note,
        params.tagIds,
        params.image
      );
      set((state) => ({
        links: [newLink, ...state.links],
        isLoading: false,
      }));
      return newLink;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add link";
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },

  removeLink: async (id: string) => {
    if (!id) return;

    set({ isLoading: true, error: null });
    try {
      await actions.deleteLink(id);
      set((state) => ({
        links: state.links.filter((link) => link.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove link";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateLink: async (id: string, params: UpdateLinkParams) => {
    if (!id || !params.title.trim() || !params.url.trim()) return;

    const updatedLink = await actions.updateLink(
      id,
      params.title,
      params.url,
      params.note,
      params.image
    );
    set((state) => ({
      links: state.links.map((link) => (link.id === id ? updatedLink : link)),
    }));
  },

  addTagToLink: async (linkId: string, tagId: string) => {
    if (!linkId || !tagId) return;

    const updatedLink = await actions.addTagToLink(linkId, tagId);

    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId ? updatedLink : link
      ),
    }));
  },

  removeTagFromLink: async (linkId: string, tagId: string) => {
    if (!linkId || !tagId) return;

    const updatedLink = await actions.removeTagFromLink(linkId, tagId);
    set((state) => ({
      links: state.links.map((link) =>
        link.id === linkId ? updatedLink : link
      ),
    }));
  },

  getLinkById: (id: string) => {
    if (!id) return undefined;
    return get().links.find((link) => link.id === id);
  },

  getLinksByTagId: (tagId: string) => {
    if (!tagId) return [];
    return get().links.filter((link) =>
      link.tags.some((tag) => tag.id === tagId)
    );
  },

  exportLinks: async () => {
    try {
      return await actions.exportLinks();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to export links";
      set({ error: errorMessage });
      throw error;
    }
  },

  importLinks: async (csvContent: string) => {
    if (!csvContent.trim()) {
      throw new Error("CSV content is required");
    }

    set({ isLoading: true, error: null });
    try {
      const count = await actions.importLinks(csvContent);
      await get().fetchLinks();
      set({ isLoading: false });
      return count;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to import links";
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },
}));
