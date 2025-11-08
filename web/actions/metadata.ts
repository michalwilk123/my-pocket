"use server";

import {
  fetchPageMetadata as fetchPageMetadataInternal,
  type PageMetadata,
} from "@/lib/metadata";

export async function fetchPageMetadata(url: string): Promise<PageMetadata> {
  return fetchPageMetadataInternal(url);
}

