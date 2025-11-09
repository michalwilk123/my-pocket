import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { UserProfileModal } from "@/components";

const meta = {
  title: "MyPocket/UserProfileModal",
  component: UserProfileModal,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    isOpen: true,
    onImport: fn(),
    onExport: fn(),
    onLogout: fn(),
    onDeleteAccount: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof UserProfileModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    user: {
      email: "user@example.com",
    },
  },
};

export const LongEmail: Story = {
  args: {
    user: {
      email: "very.long.email.address@example-domain.com",
    },
  },
};
