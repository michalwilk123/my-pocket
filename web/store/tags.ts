import { createWithEqualityFn } from "zustand/traditional";

import * as actions from "@/actions/tags";
import { Tag } from "@/lib/models";

type TagsState = {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  addTag: (label: string) => Promise<Tag | undefined>;
  removeTag: (id: string) => Promise<void>;
  updateTag: (id: string, label: string) => Promise<void>;
  getTagById: (id: string) => Tag | undefined;
  getTagByLabel: (label: string) => Tag | undefined;
};

export const useTagsStore = createWithEqualityFn<TagsState>()((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,

  fetchTags: async () => {
    set({ isLoading: true, error: null });
    try {
      const tags = await actions.fetchTags();
      set({ tags, isLoading: false });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch tags";
      set({ error: errorMessage, isLoading: false });
    }
  },

  addTag: async (label: string): Promise<Tag | undefined> => {
    if (!label.trim()) return undefined;

    set({ isLoading: true, error: null });
    try {
      const newTag = await actions.createTag(label);
      set((state) => ({
        tags: [...state.tags, newTag],
        isLoading: false,
      }));
      return newTag;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add tag";
      set({ error: errorMessage, isLoading: false });
      return undefined;
    }
  },

  removeTag: async (id: string) => {
    if (!id) return;

    set({ isLoading: true, error: null });
    try {
      await actions.deleteTag(id);
      set((state) => ({
        tags: state.tags.filter((tag) => tag.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to remove tag";
      set({ error: errorMessage, isLoading: false });
    }
  },

  updateTag: async (id: string, label: string) => {
    if (!id || !label.trim()) return;

    set({ isLoading: true, error: null });
    try {
      const updatedTag = await actions.updateTag(id, label);
      set((state) => ({
        tags: state.tags.map((tag) => (tag.id === id ? updatedTag : tag)),
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update tag";
      set({ error: errorMessage, isLoading: false });
    }
  },

  getTagById: (id: string) => {
    if (!id) return undefined;
    return get().tags.find((tag) => tag.id === id);
  },

  getTagByLabel: (label: string) => {
    if (!label.trim()) return undefined;
    const normalized = label.trim().toLowerCase();
    return get().tags.find((tag) => tag.label.toLowerCase() === normalized);
  },
}));
