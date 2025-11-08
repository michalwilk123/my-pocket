"use server";

import * as api from "@/lib/api/tags";
import { createClient } from "@/lib/supabase/server";

export async function fetchTags() {
  const supabase = await createClient();
  return api.fetchTags(supabase);
}

export async function createTag(label: string) {
  if (!label.trim()) {
    throw new Error("Tag label cannot be empty");
  }

  const supabase = await createClient();
  return api.createTag(supabase, label);
}

export async function updateTag(id: string, label: string) {
  if (!id || !label.trim()) {
    throw new Error("Tag id and label are required");
  }

  const supabase = await createClient();
  return api.updateTag(supabase, id, label);
}

export async function deleteTag(id: string) {
  if (!id) {
    throw new Error("Tag id is required");
  }

  const supabase = await createClient();
  await api.deleteTag(supabase, id);
}
