import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { TagChip } from "@/components";

const meta = {
  title: "MyPocket/TagChip",
  component: TagChip,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
} satisfies Meta<typeof TagChip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DefaultVariant: Story = {
  args: {
    id: "t1",
    label: "nextjs",
    variant: "default",
  },
};

export const PrimaryVariant: Story = {
  args: {
    id: "t2",
    label: "react",
    variant: "primary",
  },
};

export const ClickableDefault: Story = {
  args: {
    id: "t3",
    label: "typescript",
    variant: "default",
    onClick: fn(),
  },
};

export const ClickablePrimary: Story = {
  args: {
    id: "t4",
    label: "javascript",
    variant: "primary",
    onClick: fn(),
  },
};

export const LongLabel: Story = {
  args: {
    id: "t5",
    label: "very-long-tag-label-example",
    variant: "default",
  },
};
