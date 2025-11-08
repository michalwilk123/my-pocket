import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { ConfirmDeleteModal } from "@/components";

const meta = {
  title: "MyPocket/ConfirmDeleteModal",
  component: ConfirmDeleteModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onClose: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof ConfirmDeleteModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    linkTitle: "Next.js App Router Guide",
    onClose: fn(),
  },
};

export const LongTitle: Story = {
  args: {
    linkTitle:
      "A Very Long Link Title That Demonstrates How The Modal Handles Extended Content",
    onClose: fn(),
  },
};
