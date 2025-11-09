import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Modal } from "@/components";

const meta = {
  title: "MyPocket/Modal",
  component: Modal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onClose: fn(),
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithCloseButton: Story = {
  args: {
    showCloseButton: true,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    children: (
      <div>
        <h2 className="text-xl font-bold text-foreground">Modal Title</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This is a modal with a close button. Click the X, press Escape, or
          click outside to close.
        </p>
        <button className="mt-4 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
          Action Button
        </button>
      </div>
    ),
  },
};

export const NoCloseButton: Story = {
  args: {
    showCloseButton: false,
    closeOnBackdropClick: true,
    closeOnEscape: true,
    children: (
      <div>
        <h2 className="text-xl font-bold text-foreground">Modal without X</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This modal has no close button. Press Escape or click outside to
          close.
        </p>
      </div>
    ),
  },
};

export const NoBackdropClose: Story = {
  args: {
    showCloseButton: true,
    closeOnBackdropClick: false,
    closeOnEscape: true,
    children: (
      <div>
        <h2 className="text-xl font-bold text-foreground">
          Backdrop Click Disabled
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Clicking outside will not close this modal. Use the X button or press
          Escape.
        </p>
      </div>
    ),
  },
};

export const NoEscapeClose: Story = {
  args: {
    showCloseButton: true,
    closeOnBackdropClick: true,
    closeOnEscape: false,
    children: (
      <div>
        <h2 className="text-xl font-bold text-foreground">Escape Disabled</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Pressing Escape will not close this modal. Use the X button or click
          outside.
        </p>
      </div>
    ),
  },
};

export const ManualCloseOnly: Story = {
  args: {
    showCloseButton: true,
    closeOnBackdropClick: false,
    closeOnEscape: false,
    children: (
      <div>
        <h2 className="text-xl font-bold text-foreground">Manual Close Only</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This modal can only be closed by clicking the X button.
        </p>
      </div>
    ),
  },
};
