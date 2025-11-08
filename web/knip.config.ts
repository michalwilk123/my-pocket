import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
    "lib/**/*.{ts,tsx}",
    "middleware.ts",
    "next.config.ts",
    ".storybook/**/*.{ts,tsx}",
    "stories/**/*.{ts,tsx}",
  ],
  project: ["**/*.{ts,tsx}", "**/*.css"],
  ignore: [
    "**/*.stories.{ts,tsx}",
    "**/*.test.{ts,tsx}",
    "**/*.spec.{ts,tsx}",
    "i18n/**", // Used by next-intl plugin system
    ".next/**",
    "node_modules/**",
    "dist/**",
    "build/**",
    "coverage/**",
  ],
  ignoreDependencies: [
    // CSS/Tailwind dependencies (used in CSS files)
    "daisyui",
    "tailwindcss",
    "tw-animate-css",
    "@tailwindcss/postcss",
    "postcss",
    // Storybook dependencies
    "@chromatic-com/storybook",
    /^@storybook\/.*/,
    "storybook",
    // Testing dependencies
    /^@vitest\/.*/,
    "vitest",
    "playwright",
    // Build tools
    "eslint-plugin-storybook",
  ],
};

export default config;
