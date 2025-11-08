import type { SupabaseClient } from "@supabase/supabase-js";

import { Tag, mapTagFromRow } from "../models";
import { Database } from "../supabase/database.types";
import { createDB } from "../db";

type SupabaseClientLike = SupabaseClient<Database>;

function validateLabel(label: string): void {
  if (!label.trim()) {
    throw new Error("Tag label cannot be empty");
  }
}

function validateId(id: string): void {
  if (!id) {
    throw new Error("Tag id is required");
  }
}

export async function fetchTags(
  supabaseClient: SupabaseClientLike
): Promise<Tag[]> {
  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();
  const rows = await db.tags.query.selectByUserId(userId);
  return rows.map(mapTagFromRow);
}

export async function createTag(
  supabaseClient: SupabaseClientLike,
  label: string
): Promise<Tag> {
  validateLabel(label);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();
  const row = await db.tags.mutate.insert({
    label: label.trim(),
    user_id: userId,
  });

  return mapTagFromRow(row);
}

export async function updateTag(
  supabaseClient: SupabaseClientLike,
  id: string,
  label: string
): Promise<Tag> {
  validateId(id);
  validateLabel(label);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  const { data, error } = await supabaseClient
    .from("mypocket_tag")
    .update({ label: label.trim() })
    .eq("id", id)
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    throw new Error("Failed to update tag");
  }

  return mapTagFromRow(data as Database["public"]["Tables"]["mypocket_tag"]["Row"]);
}

export async function deleteTag(
  supabaseClient: SupabaseClientLike,
  id: string
): Promise<void> {
  validateId(id);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();
  await db.tags.mutate.delete(id, userId);
}

export async function getTagById(
  supabaseClient: SupabaseClientLike,
  id: string
): Promise<Tag | null> {
  validateId(id);

  const db = createDB(supabaseClient);
  const userId = await db.auth.query.getCurrentUserId();

  const { data, error } = await supabaseClient
    .from("mypocket_tag")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .single();

  if (error) {
    return null;
  }

  if (!data) {
    return null;
  }

  return mapTagFromRow(data as Database["public"]["Tables"]["mypocket_tag"]["Row"]);
}
