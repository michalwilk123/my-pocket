import { Database } from "./supabase/database.types";

type TagRow = Database["public"]["Tables"]["mypocket_tag"]["Row"];
type LinkRow = Database["public"]["Tables"]["mypocket_link"]["Row"];

export type Tag = {
  id: string;
  label: string;
};

export type Link = {
  id: string;
  title: string;
  url: string;
  note: string;
  tags: Tag[];
  image: string;
  createdAt: string;
};

function mapFromRow<TRow, TModel>(
  row: TRow,
  mapper: (row: TRow) => TModel
): TModel {
  return mapper(row);
}

export function mapTagFromRow(row: TagRow): Tag {
  return mapFromRow(row, (r) => ({
    id: r.id,
    label: r.label,
  }));
}

export function mapLinkFromRow(row: LinkRow, tags: Tag[]): Link {
  return mapFromRow(row, (r) => ({
    id: r.id,
    title: r.title,
    url: r.url,
    note: r.note ?? "",
    image: r.image ?? "",
    tags,
    createdAt: r.created_at,
  }));
}

