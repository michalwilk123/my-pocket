"use client";

import { useEffect, useRef, useState } from "react";

import { X } from "lucide-react";

type EditableTagChipProps = {
  id: string;
  label: string;
  variant?: "default" | "primary";
  onDelete: (id: string) => void;
  onEdit: (id: string, newLabel: string) => void;
  autoFocus?: boolean;
};

export function EditableTagChip(props: EditableTagChipProps) {
  const [isEditing, setIsEditing] = useState(props.autoFocus || false);
  const [value, setValue] = useState(props.label);
  const inputRef = useRef<HTMLInputElement>(null);

  const badgeClasses =
    props.variant === "primary"
      ? "badge badge-primary badge-outline badge-sm text-xs bg-white border-2"
      : "badge badge-sm text-xs bg-white border-2 border-base-300";

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    if (props.autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [props.autoFocus]);

  const handleSave = () => {
    const trimmedValue = value.trim();
    if (trimmedValue && trimmedValue !== props.label) {
      props.onEdit(props.id, trimmedValue);
    } else if (!trimmedValue) {
      // If empty, delete the tag
      props.onDelete(props.id);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    } else if (e.key === "Escape") {
      setValue(props.label);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className={`${badgeClasses} flex items-center gap-1 px-2 py-1`}>
        <span className="text-xs">#</span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
          className="bg-transparent outline-none w-20 text-xs"
          placeholder="tag name"
        />
      </div>
    );
  }

  return (
    <div className={`${badgeClasses} flex items-center gap-1.5 pl-2 pr-1`}>
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className="text-xs hover:underline"
        aria-label={`Edit tag: ${props.label}`}
      >
        #{props.label}
      </button>
      <button
        type="button"
        onClick={() => props.onDelete(props.id)}
        aria-label={`Delete tag: ${props.label}`}
        className="hover:text-error transition-colors"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
