"use client";

import { Tag } from "@/lib/models";

import { TagChip } from "./tag-chip";

type TagGroupProps = {
  tags: Tag[];
  maxRows: number;
  variant: "default" | "primary";
  onTagClick?: (id: string) => void;
};

function calculateMaxHeight(maxRows: number): string {
  const rowHeight = 32;
  const gap = 8;
  return `${maxRows * rowHeight + (maxRows - 1) * gap}px`;
}

export function TagGroup(props: TagGroupProps) {
  const maxHeight = calculateMaxHeight(props.maxRows);
  const MAX_TAG_LENGTH = 18;
  const isSingleRow = props.maxRows <= 1;
  const containerClasses = [
    "flex flex-row items-start gap-2",
    isSingleRow
      ? "flex-nowrap overflow-x-auto overflow-y-hidden pr-1"
      : "flex-wrap overflow-hidden",
  ].join(" ");

  return (
    <div className={containerClasses} style={isSingleRow ? undefined : { maxHeight }}>
      {props.tags.map((tag) => (
        <TagChip
          key={tag.id}
          id={tag.id}
          label={
            tag.label.length > MAX_TAG_LENGTH
              ? `${tag.label.slice(0, MAX_TAG_LENGTH - 1)}…`
              : tag.label
          }
          variant={props.variant}
          onClick={props.onTagClick}
        />
      ))}
    </div>
  );
}
