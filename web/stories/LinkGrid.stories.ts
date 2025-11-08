import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { LinkGrid } from "@/components";

const meta = {
  title: "MyPocket/LinkGrid",
  component: LinkGrid,
  parameters: {
    layout: "padded",
  },
  tags: ["autodocs"],
  args: {
    onEdit: fn(),
    onDelete: fn(),
    onAddClick: fn(),
    sortOrder: "newest",
  },
} satisfies Meta<typeof LinkGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    links: [],
  },
};

export const WithLinks: Story = {
  args: {
    links: [
      {
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
        createdAt: "2024-01-05T10:00:00.000Z",
      },
      {
        id: "2",
        title: "Designing For Accessibility",
        url: "https://www.a11yproject.com/checklist/",
        note: "A practical checklist for building accessible web experiences with clear examples and action items.",
        tags: [
          { id: "t4", label: "accessibility" },
          { id: "t5", label: "design" },
        ],
        image: "/example-preview.jpg",
        createdAt: "2023-12-11T12:00:00.000Z",
      },
      {
        id: "3",
        title: "Productivity Playbook",
        url: "https://linear.app/guide/product-principles",
        note: "Strategy notes on planning, prioritizing, and shipping product updates that delight users.",
        tags: [
          { id: "t6", label: "product" },
          { id: "t7", label: "strategy" },
        ],
        image: "/example-preview.jpg",
        createdAt: "2024-02-20T08:30:00.000Z",
      },
    ],
  },
};

export const SingleLink: Story = {
  args: {
    links: [
      {
        id: "1",
        title: "Next.js App Router Guide",
        url: "https://nextjs.org/docs/app/building-your-application/routing",
        note: "Learn how the App Router works, including layouts, nested routing, and streaming UI patterns.",
        tags: [
          { id: "t1", label: "nextjs" },
          { id: "t2", label: "docs" },
        ],
        image: "/example-preview.jpg",
        createdAt: "2024-02-01T09:00:00.000Z",
      },
    ],
  },
};
