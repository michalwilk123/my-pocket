import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://mypocket.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/auth/"], // Block API and auth routes from crawling
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

