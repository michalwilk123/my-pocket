import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { LinkCard } from "@/components";

const meta = {
  title: "MyPocket/LinkCard",
  component: LinkCard,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  args: {
    onEdit: fn(),
    onDelete: fn(),
    createdAt: "2024-01-01T00:00:00.000Z",
  },
} satisfies Meta<typeof LinkCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    id: "1",
    title: "Next.js App Router Guide",
    url: "https://nextjs.org/docs/app/building-your-application/routing",
    note: "Learn how the App Router works, including layouts, nested routing, and streaming UI patterns.",
    tags: [
      { id: "t1", label: "nextjs" },
      { id: "t2", label: "docs" },
      { id: "t3", label: "frontend" },
    ],
    image: "/example-preview.jpg",
    createdAt: "2024-03-01T09:15:00.000Z",
  },
};

export const WithManyTags: Story = {
  args: {
    id: "2",
    title: "Comprehensive Guide to Web Development",
    url: "https://example.com/web-dev-guide",
    note: "An extensive guide covering HTML, CSS, JavaScript, React, and modern web development practices.",
    tags: [
      { id: "t4", label: "html" },
      { id: "t5", label: "css" },
      { id: "t6", label: "javascript" },
      { id: "t7", label: "react" },
      { id: "t8", label: "typescript" },
      { id: "t9", label: "webdev" },
    ],
    image: "/example-preview.jpg",
    createdAt: "2023-11-15T14:45:00.000Z",
  },
};

export const WithLongUrl: Story = {
  args: {
    id: "3",
    title: "Article with Very Long URL",
    url: "https://example.com/very/long/path/to/article/that/will/be/truncated/in/the/display",
    note: "This demonstrates how long URLs are truncated in the card display.",
    tags: [
      { id: "t10", label: "demo" },
      { id: "t11", label: "ui" },
    ],
    image: "/example-preview.jpg",
    createdAt: "2022-08-20T16:30:00.000Z",
  },
};

export const ShortNote: Story = {
  args: {
    id: "4",
    title: "Quick Tip",
    url: "https://example.com/tip",
    note: "Short note text.",
    tags: [{ id: "t12", label: "tip" }],
    image: "/example-preview.jpg",
    createdAt: "2024-04-12T07:20:00.000Z",
  },
};
