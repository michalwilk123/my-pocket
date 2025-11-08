export type PageMetadata = {
  title: string;
  description: string;
  image: string;
};

function validateURL(urlString: string): void {
  let parsedURL: URL;
  try {
    parsedURL = new URL(urlString);
  } catch {
    throw new Error("Invalid URL");
  }

  if (parsedURL.protocol !== "http:" && parsedURL.protocol !== "https:") {
    throw new Error("Invalid protocol");
  }

  const hostname = parsedURL.hostname.toLowerCase();

  if (hostname === "localhost" || hostname.startsWith("localhost.")) {
    throw new Error("Localhost not allowed");
  }

  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(hostname) || /^\[?[0-9a-f:]+\]?$/i.test(hostname)) {
    throw new Error("IP addresses not allowed");
  }
}

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  try {
    validateURL(url);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MyPocketBot/1.0)",
      },
      signal: controller.signal,
      next: { revalidate: 3600 },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error("Failed to fetch page");
    }

    const html = await response.text();

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : url;

    const descriptionMatch =
      html.match(
        /<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i
      ) ||
      html.match(
        /<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i
      );
    const description = descriptionMatch ? descriptionMatch[1].trim() : "";

    const imageMatch =
      html.match(
        /<meta[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["']/i
      ) ||
      html.match(
        /<meta[^>]*name=["']twitter:image["'][^>]*content=["']([^"']*)["']/i
      );
    const image = imageMatch ? imageMatch[1].trim() : "";

    return {
      title,
      description,
      image,
    };
  } catch {
    return {
      title: url,
      description: "",
      image: "",
    };
  }
}



