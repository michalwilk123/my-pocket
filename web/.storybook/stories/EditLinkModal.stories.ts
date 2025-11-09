import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { EditLinkModal } from "@/components";

const meta = {
  title: "MyPocket/EditLinkModal",
  component: EditLinkModal,
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
} satisfies Meta<typeof EditLinkModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const EditingLink: Story = {
  args: {
    linkId: "1",
    url: "https://nextjs.org/docs",
    title: "Next.js Documentation",
    tags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "react" },
    ],
  },
};

export const WithManyTags: Story = {
  args: {
    linkId: "2",
    url: "https://example.com/guide",
    title: "Comprehensive Web Development Guide",
    tags: [
      { id: "t4", label: "html" },
      { id: "t5", label: "css" },
      { id: "t6", label: "javascript" },
      { id: "t7", label: "typescript" },
      { id: "t8", label: "react" },
      { id: "t9", label: "nextjs" },
    ],
  },
};

export const MinimalInfo: Story = {
  args: {
    linkId: "3",
    url: "https://example.com",
    title: "Example Site",
    tags: [{ id: "t10", label: "example" }],
  },
};

export const NoTags: Story = {
  args: {
    linkId: "4",
    url: "https://github.com",
    title: "GitHub",
    tags: [],
  },
};
