"use server";

import * as api from "@/lib/api/links";
import { createClient } from "@/lib/supabase/server";

export async function fetchLinks() {
  const supabase = await createClient();
  return api.fetchLinks(supabase);
}

export async function searchLinks(query: string, tagIds: string[]) {
  const supabase = await createClient();
  return api.searchLinks(supabase, query, tagIds);
}

export async function createLink(
  title: string,
  url: string,
  note: string,
  tagIds: string[],
  image: string
) {
  if (!title.trim() || !url.trim()) {
    throw new Error("Title and URL are required");
  }

  const supabase = await createClient();
  return api.createLink(supabase, title, url, note, tagIds, image);
}

export async function updateLink(
  id: string,
  title: string,
  url: string,
  note: string,
  image: string
) {
  if (!id || !title.trim() || !url.trim()) {
    throw new Error("Link id, title, and URL are required");
  }

  const supabase = await createClient();
  return api.updateLink(supabase, id, title, url, note, image);
}

export async function deleteLink(id: string) {
  if (!id) {
    throw new Error("Link id is required");
  }

  const supabase = await createClient();
  await api.deleteLink(supabase, id);
}

export async function addTagToLink(linkId: string, tagId: string) {
  if (!linkId || !tagId) {
    throw new Error("Link id and tag id are required");
  }

  const supabase = await createClient();
  return api.addTagToLink(supabase, linkId, tagId);
}

export async function removeTagFromLink(linkId: string, tagId: string) {
  if (!linkId || !tagId) {
    throw new Error("Link id and tag id are required");
  }

  const supabase = await createClient();
  return api.removeTagFromLink(supabase, linkId, tagId);
}

export async function exportLinks() {
  const supabase = await createClient();
  return api.exportLinksAsCsv(supabase);
}

export async function importLinks(csvContent: string) {
  if (!csvContent.trim()) {
    throw new Error("CSV content is required");
  }

  const supabase = await createClient();
  return api.importLinksFromCsv(supabase, csvContent);
}
