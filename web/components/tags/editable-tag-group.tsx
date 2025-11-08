"use client";

import { useState } from "react";

import { Plus } from "lucide-react";

import { Tag } from "@/lib/models";

import { EditableTagChip } from "./editable-tag-chip";

type EditableTagGroupProps = {
  tags: Tag[];
  onTagEdit: (id: string, newLabel: string) => void;
  onTagDelete: (id: string) => void;
  onTagAdd: (label: string) => void;
  idPrefix: string;
};

export function EditableTagGroup(props: EditableTagGroupProps) {
  const [editingTags, setEditingTags] = useState<Tag[]>([]);
  const [tempIdCounter, setTempIdCounter] = useState(0);

  const handleAddTag = () => {
    const tempId = `temp-${tempIdCounter}`;
    setTempIdCounter(tempIdCounter + 1);
    setEditingTags([...editingTags, { id: tempId, label: "" }]);
  };

  // TODO: Why temp everywhere
  const handleEditTag = (id: string, newLabel: string) => {
    const isTempTag = editingTags.some((tag) => tag.id === id);

    if (isTempTag) {
      // This is a new tag being created
      props.onTagAdd(newLabel);
      setEditingTags(editingTags.filter((tag) => tag.id !== id));
    } else {
      // This is an existing tag being edited
      props.onTagEdit(id, newLabel);
    }
  };

  const handleDeleteTag = (id: string) => {
    const isTempTag = editingTags.some((tag) => tag.id === id);

    if (isTempTag) {
      // Remove from temporary editing tags
      setEditingTags(editingTags.filter((tag) => tag.id !== id));
    } else {
      // Delete existing tag
      props.onTagDelete(id);
    }
  };

  const allTags = [...props.tags, ...editingTags];

  return (
    <div
      id={`${props.idPrefix}-tags`}
      role="group"
      aria-label="Tags list"
      className="flex flex-col gap-2.5 rounded-box border border-dashed border-primary/40 bg-primary/5 p-3.5"
    >
      <div className="flex flex-row flex-wrap gap-2 items-start">
        {allTags.map((tag) => {
          const isNewTag = editingTags.some((t) => t.id === tag.id);
          return (
            <EditableTagChip
              key={tag.id}
              id={tag.id}
              label={tag.label}
              variant="primary"
              onDelete={handleDeleteTag}
              onEdit={handleEditTag}
              autoFocus={isNewTag}
            />
          );
        })}
      </div>
      <button
        type="button"
        onClick={handleAddTag}
        aria-label="Add new tag"
        className="btn btn-outline btn-primary btn-xs w-fit gap-1.5"
      >
        <Plus className="h-3.5 w-3.5" />
        <span className="text-xs">New tag</span>
      </button>
    </div>
  );
}
