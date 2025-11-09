import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { TagGroup } from "@/components";

const meta = {
  title: "MyPocket/TagGroup",
  component: TagGroup,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TagGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const SingleRow: Story = {
  args: {
    tags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "react" },
      { id: "t3", label: "typescript" },
      { id: "t4", label: "tailwind" },
    ],
    maxRows: 1,
    variant: "default",
  },
};

export const TwoRows: Story = {
  args: {
    tags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "react" },
      { id: "t3", label: "typescript" },
      { id: "t4", label: "tailwind" },
      { id: "t5", label: "zustand" },
      { id: "t6", label: "tanstack" },
    ],
    maxRows: 2,
    variant: "default",
  },
};

export const PrimaryVariant: Story = {
  args: {
    tags: [
      { id: "t1", label: "research" },
      { id: "t2", label: "design" },
      { id: "t3", label: "development" },
      { id: "t4", label: "testing" },
    ],
    maxRows: 2,
    variant: "primary",
  },
};

export const ManyTagsScrollable: Story = {
  args: {
    tags: [
      { id: "t1", label: "javascript" },
      { id: "t2", label: "typescript" },
      { id: "t3", label: "react" },
      { id: "t4", label: "nextjs" },
      { id: "t5", label: "tailwind" },
      { id: "t6", label: "css" },
      { id: "t7", label: "html" },
      { id: "t8", label: "node" },
      { id: "t9", label: "express" },
      { id: "t10", label: "mongodb" },
    ],
    maxRows: 2,
    variant: "default",
  },
};

export const Clickable: Story = {
  args: {
    tags: [
      { id: "t1", label: "clickable" },
      { id: "t2", label: "tags" },
      { id: "t3", label: "example" },
    ],
    maxRows: 1,
    variant: "primary",
    onTagClick: fn(),
  },
};
