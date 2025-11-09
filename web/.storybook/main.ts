import type { StorybookConfig } from "@storybook/nextjs";

const config: StorybookConfig = {
  stories: [".storybook/stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
  addons: [],
  framework: {
    name: "@storybook/nextjs",
    options: {},
  },
  staticDirs: ["../public"],
};
export default config;
