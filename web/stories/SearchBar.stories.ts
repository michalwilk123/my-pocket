import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { SearchBar } from "@/components";

const meta = {
  title: "MyPocket/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onSearchChange: fn(),
    onTagToggle: fn(),
    onSortChange: fn(),
    onSearchSubmit: fn(),
    sortOrder: "newest",
  },
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    searchQuery: "",
    selectedTags: [],
    availableTags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "frontend" },
      { id: "t4", label: "accessibility" },
      { id: "t5", label: "design" },
      { id: "t6", label: "product" },
      { id: "t7", label: "strategy" },
    ],
  },
};

export const WithSearchQuery: Story = {
  args: {
    searchQuery: "Next.js routing",
    selectedTags: [],
    availableTags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "frontend" },
      { id: "t4", label: "accessibility" },
      { id: "t5", label: "design" },
    ],
  },
};

export const WithSelectedTags: Story = {
  args: {
    searchQuery: "",
    selectedTags: ["t1", "t3"],
    availableTags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "frontend" },
      { id: "t4", label: "accessibility" },
      { id: "t5", label: "design" },
    ],
  },
};

export const WithSearchAndTags: Story = {
  args: {
    searchQuery: "routing patterns",
    selectedTags: ["t1", "t2", "t3"],
    availableTags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "frontend" },
      { id: "t4", label: "accessibility" },
      { id: "t5", label: "design" },
      { id: "t6", label: "product" },
    ],
  },
};

export const ManyTags: Story = {
  args: {
    searchQuery: "",
    selectedTags: ["t2", "t5", "t8"],
    availableTags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "frontend" },
      { id: "t4", label: "accessibility" },
      { id: "t5", label: "design" },
      { id: "t6", label: "product" },
      { id: "t7", label: "strategy" },
      { id: "t8", label: "inspiration" },
      { id: "t9", label: "visual" },
      { id: "t10", label: "library" },
      { id: "t11", label: "zustand" },
      { id: "t12", label: "state" },
      { id: "t13", label: "tailwind" },
      { id: "t14", label: "components" },
      { id: "t15", label: "ui" },
    ],
  },
};
