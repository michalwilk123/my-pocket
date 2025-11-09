import type { Meta, StoryObj } from "@storybook/nextjs";
import { fn } from "storybook/test";

import { Header } from "@/components";

const meta = {
  title: "MyPocket/Header",
  component: Header,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  args: {
    onAddClick: fn(),
    onProfileClick: fn(),
    userAvatar: null,
    userName: null,
    locale: "en",
  },
} satisfies Meta<typeof Header>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
