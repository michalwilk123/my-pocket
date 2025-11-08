"use client";

import { Tag } from "@/lib/models";

type TagChipProps = Tag & {
  onClick?: (id: string) => void;
  variant: "default" | "primary";
};

export function TagChip(props: TagChipProps) {
  const badgeClasses =
    props.variant === "primary"
      ? "badge badge-primary badge-outline badge-sm text-xs bg-white border-2"
      : "badge badge-sm text-xs bg-white border-2 border-base-300";

  if (props.onClick) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          props.onClick?.(props.id);
        }}
        aria-label={`Tag: ${props.label}`}
        className={`${badgeClasses} cursor-pointer transition-all hover:badge-primary`}
      >
        #{props.label}
      </button>
    );
  }

  return <span className={badgeClasses}>#{props.label}</span>;
}
