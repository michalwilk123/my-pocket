import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { Geist, Geist_Mono } from "next/font/google";

import { AuthProvider } from "@/components";
import { ModalManagerProvider } from "@/contexts/modals";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_BASE_URL || "https://mypocket.app",
  ),
  title: "My Pocket: Save and Organize Your Favorite Links",
  description:
    "A focused space to store, revisit, and organize your favorite links.",
  keywords: [
    "bookmark manager",
    "save links",
    "organize bookmarks",
    "link management",
    "web clipper",
    "read later",
    "pocket alternative",
  ],
  openGraph: {
    title: "My Pocket: Save and Organize Your Favorite Links",
    description:
      "A focused space to store, revisit, and organize your favorite links.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "My Pocket",
    images: [
      {
        url: "/android-chrome-512x512.png",
        width: 512,
        height: 512,
        alt: "My Pocket Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "My Pocket: Save and Organize Your Favorite Links",
    description:
      "A focused space to store, revisit, and organize your favorite links.",
    images: ["/android-chrome-512x512.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/site.webmanifest",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();
  const locale = await getLocale();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mypocket.app";

  // JSON-LD structured data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: "My Pocket",
        description:
          "A focused space to store, revisit, and organize your favorite links.",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${baseUrl}/?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${baseUrl}/#softwareapplication`,
        name: "My Pocket",
        applicationCategory: "Utility",
        operatingSystem: "Web Browser, Chrome, Firefox, Edge",
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "USD",
        },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: "5",
          ratingCount: "1",
        },
        description:
          "Save, organize, and access your favorite links across all devices. A powerful bookmark manager with tagging and search capabilities.",
        url: baseUrl,
        screenshot: `${baseUrl}/example-preview.jpg`,
        featureList: [
          "Save links with one click",
          "Organize bookmarks with tags",
          "Full-text search across saved links",
          "Browser extension support",
          "Cross-device synchronization",
        ],
      },
      {
        "@type": "Organization",
        "@id": `${baseUrl}/#organization`,
        name: "My Pocket",
        url: baseUrl,
        logo: {
          "@type": "ImageObject",
          url: `${baseUrl}/logo.svg`,
          width: 512,
          height: 512,
        },
        sameAs: [],
      },
    ],
  };

  return (
    <html lang={locale} data-theme="mypocket">
      <head>
        <link rel="manifest" href="/site.webmanifest" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-base-100 text-base-content`}
      >
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <ModalManagerProvider>{children}</ModalManagerProvider>
          </AuthProvider>
        </NextIntlClientProvider>
        <div id="mypocket-modal-root" />
        <div id="mypocket-toast-root" />
        <Analytics />
      </body>
    </html>
  );
}
