import type { SupabaseClient } from "@supabase/supabase-js";
import type { PostgrestError } from "@supabase/supabase-js";
import { Database } from "./supabase/database.types";

type SupabaseClientLike = SupabaseClient<Database>;

function handleError(error: PostgrestError | null): void {
  if (error) {
    throw new Error(error.message);
  }
}

function handleSingleResult<T>(
  response: { data: T | null; error: PostgrestError | null },
  fallbackMessage: string
): T {
  handleError(response.error);
  
  if (!response.data) {
    throw new Error(fallbackMessage);
  }
  
  return response.data;
}

function handleManyResult<T>(
  response: { data: T[] | null; error: PostgrestError | null }
): T[] {
  handleError(response.error);
  return response.data ?? [];
}

function handleVoidResult(
  response: { error: PostgrestError | null }
): void {
  handleError(response.error);
}

abstract class DBBase {
  protected client: SupabaseClientLike;

  constructor(client: SupabaseClientLike) {
    this.client = client;
  }
}

class DBLinks extends DBBase {
  query = {
    selectById: async (linkId: string, userId: string) => {
      const response = await this.client
        .from("mypocket_link")
        .select("*")
        .eq("id", linkId)
        .eq("user_id", userId)
        .single();

      return handleSingleResult(response, "Link not found") as Database["public"]["Tables"]["mypocket_link"]["Row"];
    },

    selectByUserId: async (userId: string) => {
      const response = await this.client
        .from("mypocket_link")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      return handleManyResult(response) as Database["public"]["Tables"]["mypocket_link"]["Row"][];
    },

    selectByUserIdWithQuery: async (userId: string, query: string) => {
      let queryBuilder = this.client
        .from("mypocket_link")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (query.length > 0) {
        queryBuilder = queryBuilder.or(
          `title.ilike.%${query}%,url.ilike.%${query}%,note.ilike.%${query}%`
        );
      }

      const response = await queryBuilder;
      return handleManyResult(response) as Database["public"]["Tables"]["mypocket_link"]["Row"][];
    },

    selectLinkTagsByLinkIds: async (linkIds: string[]) => {
      if (linkIds.length === 0) {
        return [];
      }

      const response = await this.client
        .from("mypocket_link_tag")
        .select("link_id, tag_id, mypocket_tag(id, user_id, label, created_at, updated_at)")
        .in("link_id", linkIds);

      const data = handleManyResult(response);
      return data.map((row: any) => ({
        link_id: row.link_id,
        tag_id: row.tag_id,
        tag: row.mypocket_tag as Database["public"]["Tables"]["mypocket_tag"]["Row"] | null,
      }));
    },

    selectLinkTagsByTagId: async (tagId: string) => {
      const response = await this.client
        .from("mypocket_link_tag")
        .select("link_id")
        .eq("tag_id", tagId);

      return handleManyResult(response) as Array<{ link_id: string }>;
    },
  };

  mutate = {
    insert: async (link: Database["public"]["Tables"]["mypocket_link"]["Insert"]) => {
      const response = await this.client
        .from("mypocket_link")
        .insert(link)
        .select()
        .single();

      return handleSingleResult(response, "Failed to insert link") as Database["public"]["Tables"]["mypocket_link"]["Row"];
    },

    upsert: async (
      links: Database["public"]["Tables"]["mypocket_link"]["Insert"][],
      onConflict: string
    ) => {
      const response = await this.client
        .from("mypocket_link")
        .upsert(links, { onConflict, ignoreDuplicates: true })
        .select("id, url");

      return handleManyResult(response) as Array<{ id: string; url: string }>;
    },

    update: async (
      linkId: string,
      userId: string,
      updates: { title: string; url: string; note: string; image: string }
    ) => {
      const response = await this.client
        .from("mypocket_link")
        .update(updates)
        .eq("id", linkId)
        .eq("user_id", userId)
        .select()
        .single();

      return handleSingleResult(response, "Failed to update link") as Database["public"]["Tables"]["mypocket_link"]["Row"];
    },

    delete: async (linkId: string, userId: string) => {
      const response = await this.client
        .from("mypocket_link")
        .delete()
        .eq("id", linkId)
        .eq("user_id", userId);

      handleVoidResult(response);
    },

    insertLinkTag: async (linkTag: Database["public"]["Tables"]["mypocket_link_tag"]["Insert"]) => {
      const response = await this.client
        .from("mypocket_link_tag")
        .insert(linkTag);

      if (response.error) {
        if (response.error.code === "23505") {
          throw new Error("Tag already added to this link");
        }
        throw new Error(response.error.message);
      }
    },

    upsertLinkTags: async (
      linkTags: Database["public"]["Tables"]["mypocket_link_tag"]["Insert"][],
      onConflict: string
    ) => {
      if (linkTags.length === 0) {
        return;
      }

      const response = await this.client
        .from("mypocket_link_tag")
        .upsert(linkTags, { onConflict, ignoreDuplicates: true });

      handleVoidResult(response);
    },

    deleteLinkTag: async (linkId: string, tagId: string) => {
      const response = await this.client
        .from("mypocket_link_tag")
        .delete()
        .eq("link_id", linkId)
        .eq("tag_id", tagId);

      handleVoidResult(response);
    },
  };
}

class DBTags extends DBBase {
  query = {
    selectByUserId: async (userId: string) => {
      const response = await this.client
        .from("mypocket_tag")
        .select("*")
        .eq("user_id", userId)
        .order("label", { ascending: true });

      return handleManyResult(response) as Database["public"]["Tables"]["mypocket_tag"]["Row"][];
    },
  };

  mutate = {
    insert: async (tag: Database["public"]["Tables"]["mypocket_tag"]["Insert"]) => {
      const response = await this.client
        .from("mypocket_tag")
        .insert(tag)
        .select()
        .single();

      return handleSingleResult(response, "Failed to insert tag") as Database["public"]["Tables"]["mypocket_tag"]["Row"];
    },

    upsert: async (
      tags: Database["public"]["Tables"]["mypocket_tag"]["Insert"][],
      onConflict: string
    ) => {
      if (tags.length === 0) {
        return;
      }

      const response = await this.client
        .from("mypocket_tag")
        .upsert(tags, { onConflict, ignoreDuplicates: true });

      handleVoidResult(response);
    },

    delete: async (tagId: string, userId: string) => {
      const response = await this.client
        .from("mypocket_tag")
        .delete()
        .eq("id", tagId)
        .eq("user_id", userId);

      handleVoidResult(response);
    },

    removeOrphanedTags: async (userId: string) => {
      const tagsResponse = await this.client
        .from("mypocket_tag")
        .select("id")
        .eq("user_id", userId);

      const userTagIds = handleManyResult(tagsResponse).map((row: any) => row.id);

      if (userTagIds.length === 0) {
        return;
      }

      const linkTagsResponse = await this.client
        .from("mypocket_link_tag")
        .select("tag_id")
        .in("tag_id", userTagIds);

      const linkedTagIds = new Set(
        handleManyResult(linkTagsResponse).map((row: any) => row.tag_id)
      );

      const orphanedTagIds = userTagIds.filter(id => !linkedTagIds.has(id));

      if (orphanedTagIds.length > 0) {
        const deleteResponse = await this.client
          .from("mypocket_tag")
          .delete()
          .in("id", orphanedTagIds);
        handleVoidResult(deleteResponse);
      }
    },
  };
}

class DBAuth extends DBBase {
  query = {
    getCurrentUserId: async () => {
      const { data: { user }, error } = await this.client.auth.getUser();

      if (error || !user) {
        throw new Error("User not authenticated");
      }

      return user.id;
    },
  };
}

export function createDB(client: SupabaseClientLike) {
  return {
    links: new DBLinks(client),
    tags: new DBTags(client),
    auth: new DBAuth(client),
  };
}

