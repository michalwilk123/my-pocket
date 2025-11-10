import type { SupabaseClient } from "@supabase/supabase-js";

import { Link, Tag, mapLinkFromRow, mapTagFromRow } from "../models";
import { fetchPageMetadata } from "../metadata";
import { Database } from "../supabase/database.types";
import { CsvLinkRow, generateCsvContent, parseCsvContent } from "../utils/csv";
import { createDB } from "../db";

type SupabaseClientLike = SupabaseClient<Database>;

function validateLinkId(id: string): void {
  if (!id) {
    throw new Error("Link id is required");
  }
}

function validateLinkData(title: string, url: string): void {
  if (!title.trim() || !url.trim()) {
    throw new Error("Title and URL are required");
  }
}

function validateTagIds(linkId: string, tagId: string): void {
  if (!linkId || !tagId) {
    throw new Error("Link id and tag id are required");
  }
}

function groupTagsByLinkId(
  linkTagRows: Array<{ link_id: string; tag_id: string; tag: Database["public"]["Tables"]["mypocket_tag"]["Row"] | null }>
): Map<string, Tag[]> {
  const linkTagsMap = new Map<string, Tag[]>();

  for (const row of linkTagRows) {
    if (!linkTagsMap.has(row.link_id)) {
      linkTagsMap.set(row.link_id, []);
    }
    if (row.tag) {
      linkTagsMap.get(row.link_id)!.push(mapTagFromRow(row.tag));
    }
  }

  return linkTagsMap;
}

function buildLinksWithTags(
  linkRows: Database["public"]["Tables"]["mypocket_link"]["Row"][],
  linkTagsMap: Map<string, Tag[]>
): Link[] {
  return linkRows.map((link) => {
    const tags = linkTagsMap.get(link.id) ?? [];
    return mapLinkFromRow(link, tags);
  });
}

export async function fetchLinks(
  supabaseClient: SupabaseClientLike
): Promise<Link[]> {
  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();
  const linkRows = await db.links.query.selectByUserId(userId);

  if (linkRows.length === 0) {
    return [];
  }

  const linkIds = linkRows.map((link) => link.id);
  const linkTagRows = await db.links.query.selectLinkTagsByLinkIds(linkIds);
  const linkTagsMap = groupTagsByLinkId(linkTagRows);

  return buildLinksWithTags(linkRows, linkTagsMap);
}

export async function searchLinks(
  supabaseClient: SupabaseClientLike,
  query: string,
  tagIds: string[]
): Promise<Link[]> {
  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();
  const normalizedQuery = query.trim().toLowerCase();

  const linkRows = await db.links.query.selectByUserIdWithQuery(
    userId,
    normalizedQuery
  );

  if (linkRows.length === 0) {
    return [];
  }

  const linkIds = linkRows.map((link) => link.id);
  const linkTagRows = await db.links.query.selectLinkTagsByLinkIds(linkIds);
  const linkTagsMap = groupTagsByLinkId(linkTagRows);

  let links = buildLinksWithTags(linkRows, linkTagsMap);

  if (tagIds.length > 0) {
    links = links.filter((link) =>
      link.tags.some((tag) => tagIds.includes(tag.id))
    );
  }

  return links;
}

export async function createLink(
  supabaseClient: SupabaseClientLike,
  title: string,
  url: string,
  note: string,
  tagIds: string[],
  image: string
): Promise<Link> {
  validateLinkData(title, url);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  const normalizedTitle = title.trim();
  const normalizedUrl = url.trim();
  const normalizedNote = note.trim();
  const normalizedImage = image.trim();

  const createdLink = await db.links.mutate.insert({
    title: normalizedTitle,
    url: normalizedUrl,
    note: normalizedNote,
    image: normalizedImage,
    user_id: userId,
  });

  let linkRow = createdLink;

  if (tagIds.length > 0) {
    const linkTagsInserts = tagIds.map((tagId) => ({
      link_id: createdLink.id,
      tag_id: tagId,
    }));

    await db.links.mutate.upsertLinkTags(linkTagsInserts, "link_id,tag_id");
  }

  let tags: Tag[] = [];
  if (tagIds.length > 0) {
    const tagRows = await db.tags.query.selectByUserId(userId);
    tags = tagRows
      .filter((row) => tagIds.includes(row.id))
      .map(mapTagFromRow);
  }

  try {
    const metadata = await fetchPageMetadata(normalizedUrl);

    const metadataTitle = metadata.title.trim();
    const metadataDescription = metadata.description.trim();
    const metadataImage = metadata.image.trim();

    const shouldUpdateTitle =
      metadataTitle.length > 0 &&
      metadataTitle !== normalizedUrl &&
      metadataTitle !== normalizedTitle;
    const shouldUpdateNote =
      normalizedNote.length === 0 && metadataDescription.length > 0;
    const shouldUpdateImage =
      metadataImage.length > 0 && metadataImage !== normalizedImage;

    if (shouldUpdateTitle || shouldUpdateNote || shouldUpdateImage) {
      const updatedTitle = shouldUpdateTitle
        ? metadataTitle.substring(0, 255)
        : linkRow.title;
      const updatedNote = shouldUpdateNote
        ? metadataDescription.substring(0, 512)
        : linkRow.note;
      const updatedImage = shouldUpdateImage ? metadataImage : linkRow.image;

      linkRow = await db.links.mutate.update(createdLink.id, userId, {
        title: updatedTitle,
        url: linkRow.url,
        note: updatedNote,
        image: updatedImage,
      });
    }
  } catch {
    // Ignore metadata failures, leaving the original values in place.
  }

  return mapLinkFromRow(linkRow, tags);
}

export async function updateLink(
  supabaseClient: SupabaseClientLike,
  id: string,
  title: string,
  url: string,
  note: string,
  image: string
): Promise<Link> {
  validateLinkId(id);
  validateLinkData(title, url);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  const updatedLink = await db.links.mutate.update(id, userId, {
      title: title.trim(),
      url: url.trim(),
      note: note.trim(),
      image: image.trim(),
  });

  const linkTagRows = await db.links.query.selectLinkTagsByLinkIds([id]);

  const tags = linkTagRows
    .filter((row) => row.tag !== null)
    .map((row) => mapTagFromRow(row.tag!));

  return mapLinkFromRow(updatedLink, tags);
}

export async function deleteLink(
  supabaseClient: SupabaseClientLike,
  id: string
): Promise<void> {
  validateLinkId(id);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();
  await db.links.mutate.delete(id, userId);
  await db.tags.mutate.removeOrphanedTags(userId);
}

export async function addTagToLink(
  supabaseClient: SupabaseClientLike,
  linkId: string,
  tagId: string
): Promise<Link> {
  validateTagIds(linkId, tagId);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  await db.links.mutate.insertLinkTag({ link_id: linkId, tag_id: tagId });

  const linkTagRows = await db.links.query.selectLinkTagsByLinkIds([linkId]);
  const tags = linkTagRows
    .filter((row) => row.tag !== null)
    .map((row) => mapTagFromRow(row.tag!));

  const linkRow = await db.links.query.selectById(linkId, userId);

  return mapLinkFromRow(linkRow, tags);
}

export async function removeTagFromLink(
  supabaseClient: SupabaseClientLike,
  linkId: string,
  tagId: string
): Promise<Link> {
  validateTagIds(linkId, tagId);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  await db.links.mutate.deleteLinkTag(linkId, tagId);
  await db.tags.mutate.removeOrphanedTags(userId);

  const linkTagRows = await db.links.query.selectLinkTagsByLinkIds([linkId]);
  const tags = linkTagRows
    .filter((row) => row.tag !== null)
    .map((row) => mapTagFromRow(row.tag!));

  const linkRow = await db.links.query.selectById(linkId, userId);

  return mapLinkFromRow(linkRow, tags);
}

export async function getLinksByTagId(
  supabaseClient: SupabaseClientLike,
  tagId: string
): Promise<Link[]> {
  validateLinkId(tagId);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  const linkTagRows = await db.links.query.selectLinkTagsByTagId(tagId);

  if (linkTagRows.length === 0) {
    return [];
  }

  const linkIds = linkTagRows.map((lt) => lt.link_id);
  const linkRows = await db.links.query.selectByUserId(userId);
  const filteredLinkRows = linkRows.filter((link) => linkIds.includes(link.id));

  const allLinkTagRows = await db.links.query.selectLinkTagsByLinkIds(linkIds);

  const linkTagsMap = groupTagsByLinkId(allLinkTagRows);

  return buildLinksWithTags(filteredLinkRows, linkTagsMap);
}

export async function exportLinksAsCsv(
  supabaseClient: SupabaseClientLike
): Promise<string> {
  const links = await fetchLinks(supabaseClient);

  const rows: CsvLinkRow[] = links.map((link) => ({
    title: link.title,
    url: link.url,
    time_added: Math.floor(new Date(link.createdAt).getTime() / 1000),
    tags: link.tags.map((tag) => tag.label),
    status: "unread",
  }));

  return generateCsvContent(rows);
}

export async function importLinksFromCsv(
  supabaseClient: SupabaseClientLike,
  csvContent: string
): Promise<number> {
  const rows = parseCsvContent(csvContent);

  if (rows.length === 0) {
    return 0;
  }

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  const allTagLabels = new Set<string>();
  for (const row of rows) {
    for (const tagLabel of row.tags) {
      const normalized = tagLabel.trim().toLowerCase();
      if (normalized) {
        allTagLabels.add(normalized);
      }
    }
  }

  if (allTagLabels.size > 0) {
    const tagInserts = Array.from(allTagLabels).map((label) => ({
      label: label,
      user_id: userId,
    }));

    await db.tags.mutate.upsert(tagInserts, "user_id,label");
  }

  const tagRows = await db.tags.query.selectByUserId(userId);
  const tagLabelToId = new Map<string, string>();
  for (const tag of tagRows) {
    tagLabelToId.set(tag.label.toLowerCase(), tag.id);
    }

  const linksToInsert: Array<{
    title: string;
    url: string;
    note: string;
    image: string;
    user_id: string;
    created_at: string;
    tagIds: string[];
  }> = [];

  for (const row of rows) {
    const url = row.url.trim();
    if (!url) {
      continue;
    }

    const title = row.title.trim() || url;
    const createdAtISO = new Date(row.time_added * 1000).toISOString();

    const tagIds = row.tags
      .map((label) => tagLabelToId.get(label.trim().toLowerCase()))
      .filter((id): id is string => Boolean(id));

    linksToInsert.push({
      title,
      url,
          note: "",
          image: "",
          user_id: userId,
          created_at: createdAtISO,
      tagIds,
    });
  }

  if (linksToInsert.length === 0) {
    return 0;
  }

  const linkInserts = linksToInsert.map(({ tagIds, ...link }) => link);

  const insertedLinksData = await db.links.mutate.upsert(linkInserts, "user_id,url");

  const urlToLinkId = new Map<string, string>();
  for (const link of insertedLinksData) {
    urlToLinkId.set(link.url, link.id);
      }

  const linkTagInserts: Array<{ link_id: string; tag_id: string }> = [];

  for (const linkData of linksToInsert) {
    const linkId = urlToLinkId.get(linkData.url);
    if (linkId && linkData.tagIds.length > 0) {
      for (const tagId of linkData.tagIds) {
        linkTagInserts.push({
          link_id: linkId,
          tag_id: tagId,
        });
      }
    }
  }

  await db.links.mutate.upsertLinkTags(linkTagInserts, "link_id,tag_id");

  return insertedLinksData.length;
}
