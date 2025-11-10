"use client";

import { useEffect, useMemo, useState } from "react";

import { shallow } from "zustand/shallow";

import { AddLinkModal } from "@/components";
import { useLinksStore, useTagsStore } from "@/store";

type AddLinkModalContainerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function AddLinkModalContainer(props: AddLinkModalContainerProps) {
  const { addLink, updateLink } = useLinksStore(
    (state) => ({
      addLink: state.addLink,
      updateLink: state.updateLink,
    }),
    shallow
  );

  const { tags, addTag, updateTag, removeTag, getTagByLabel } = useTagsStore(
    (state) => ({
      tags: state.tags,
      addTag: state.addTag,
      updateTag: state.updateTag,
      removeTag: state.removeTag,
      getTagByLabel: state.getTagByLabel,
    }),
    shallow
  );

  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!props.isOpen) {
      setUrl("");
      setTitle("");
      setSelectedTagIds([]);
      setIsSaving(false);
    }
  }, [props.isOpen]);

  const selectedTags = useMemo(
    () => tags.filter((tag) => selectedTagIds.includes(tag.id)),
    [tags, selectedTagIds]
  );

  async function handleUrlChange(nextUrl: string) {
    setUrl(nextUrl);
  }

  function handleTitleChange(nextTitle: string) {
    setTitle(nextTitle);
  }

  async function handleTagAdd(label: string) {
    if (!label.trim()) return;
    const existingTag = getTagByLabel(label);
    if (existingTag) {
      setSelectedTagIds((prev) =>
        prev.includes(existingTag.id) ? prev : [...prev, existingTag.id]
      );
    } else {
      const newTag = await addTag(label);
      if (newTag) {
        setSelectedTagIds((prev) => [...prev, newTag.id]);
      }
    }
  }

  async function handleTagEdit(id: string, newLabel: string) {
    if (!newLabel.trim()) return;
    await updateTag(id, newLabel);
  }

  async function handleTagDelete(id: string) {
    await removeTag(id);
    setSelectedTagIds((prev) => prev.filter((tagId) => tagId !== id));
  }

  async function handleSave() {
    if (!url.trim() || isSaving) return;
    setIsSaving(true);

    const linkUrl = url.trim();
    const linkTitle = (title.trim() || "Loading title...").substring(0, 255);

    try {
      const newLink = await addLink({
        title: linkTitle,
        url: linkUrl,
        note: "",
        image: "",
        tagIds: selectedTagIds,
      });

      props.onClose();

      if (!newLink) {
        return;
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <AddLinkModal
      isOpen={props.isOpen}
      url={url}
      title={title}
      tags={selectedTags}
      isSaving={isSaving}
      onUrlChange={handleUrlChange}
      onTitleChange={handleTitleChange}
      onTagEdit={handleTagEdit}
      onTagDelete={handleTagDelete}
      onTagAdd={handleTagAdd}
      onSave={handleSave}
      onClose={props.onClose}
    />
  );
}
