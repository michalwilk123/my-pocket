import type { Preview } from "@storybook/nextjs-vite";
import { NextIntlClientProvider } from "next-intl";
import { Geist, Geist_Mono } from "next/font/google";
import React, { useEffect } from "react";

import "../app/globals.css";
import enMessages from "../messages/en.json";
import plMessages from "../messages/pl.json";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const messages = {
  en: enMessages,
  pl: plMessages,
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const locale = context.globals.locale || "en";
      
      useEffect(() => {
        // Set data-theme on the html element for daisyUI
        document.documentElement.setAttribute("data-theme", "mypocket");
        // Add theme and font classes to body
        document.body.className = `${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content`;
      }, []);
      
      return (
        <NextIntlClientProvider 
          locale={locale} 
          messages={messages[locale as keyof typeof messages]}
        >
          <Story />
        </NextIntlClientProvider>
      );
    },
  ],
  globalTypes: {
    locale: {
      description: "Internationalization locale",
      defaultValue: "en",
      toolbar: {
        icon: "globe",
        items: [
          { value: "en", title: "English" },
          { value: "pl", title: "Polski" },
        ],
        showName: true,
      },
    },
  },
};

export default preview;
