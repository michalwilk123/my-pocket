import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { AddLinkModal } from "@/components";

const meta = {
  title: "MyPocket/AddLinkModal",
  component: AddLinkModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onUrlChange: fn(),
    onTitleChange: fn(),
    onTagEdit: fn(),
    onTagDelete: fn(),
    onTagAdd: fn(),
    onSave: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof AddLinkModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    url: "",
    title: "",
    tags: [],
  },
};

export const WithPlaceholder: Story = {
  args: {
    url: "https://",
    title: "",
    tags: [],
  },
};

export const PartiallyFilled: Story = {
  args: {
    url: "https://example.com/article",
    title: "Interesting Article",
    tags: [{ id: "t1", label: "research" }],
  },
};

export const WithMultipleTags: Story = {
  args: {
    url: "https://nextjs.org/docs",
    title: "Next.js Documentation",
    tags: [
      { id: "t2", label: "nextjs" },
      { id: "t3", label: "docs" },
      { id: "t4", label: "react" },
      { id: "t5", label: "frontend" },
    ],
  },
};

export const ReadyToSave: Story = {
  args: {
    url: "https://github.com/vercel/next.js",
    title: "Next.js GitHub Repository",
    tags: [
      { id: "t6", label: "nextjs" },
      { id: "t7", label: "github" },
      { id: "t8", label: "opensource" },
    ],
  },
};
