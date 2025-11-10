"use client";

import { useEffect, useState } from "react";

import { shallow } from "zustand/shallow";

import { EditLinkModal } from "@/components";
import { Link } from "@/lib/models";
import { useLinksStore, useTagsStore, useToastStore } from "@/store";

type EditLinkModalContainerProps = {
  isOpen: boolean;
  linkId: string;
  onClose: () => void;
};

export function EditLinkModalContainer(props: EditLinkModalContainerProps) {
  const { getLinkById, updateLink, addTagToLink, removeTagFromLink } =
    useLinksStore(
      (state) => ({
        getLinkById: state.getLinkById,
        updateLink: state.updateLink,
        addTagToLink: state.addTagToLink,
        removeTagFromLink: state.removeTagFromLink,
      }),
      shallow
    );

  const { addTag, updateTag, getTagByLabel } = useTagsStore(
    (state) => ({
      addTag: state.addTag,
      updateTag: state.updateTag,
      getTagByLabel: state.getTagByLabel,
    }),
    shallow
  );

  const showToast = useToastStore((state) => state.showToast);

  const [editTarget, setEditTarget] = useState<Link | null>(null);

  // Load link snapshot when opened or id changes
  useEffect(() => {
    if (props.isOpen && props.linkId) {
      const link = getLinkById(props.linkId) || null;
      setEditTarget(link);
    } else if (!props.isOpen) {
      setEditTarget(null);
    }
  }, [props.isOpen, props.linkId]);

  const linkId = props.linkId ?? "";

  function handleUrlChange(url: string) {
    if (!editTarget) return;
    setEditTarget({ ...editTarget, url });
  }

  function handleTitleChange(title: string) {
    if (!editTarget) return;
    setEditTarget({ ...editTarget, title });
  }

  function handleTagAdd(label: string) {
    if (!label.trim() || !editTarget) return;

    const tempTag = {
      id: `temp-${Date.now()}`,
      label: label.trim(),
    };

    setEditTarget({
      ...editTarget,
      tags: [...editTarget.tags, tempTag],
    });
  }

  function handleTagEdit(id: string, newLabel: string) {
    if (!newLabel.trim() || !editTarget) return;
    setEditTarget({
      ...editTarget,
      tags: editTarget.tags.map((tag) =>
        tag.id === id ? { ...tag, label: newLabel } : tag
      ),
    });
  }

  function handleTagDelete(id: string) {
    if (!editTarget) return;
    setEditTarget({
      ...editTarget,
      tags: editTarget.tags.filter((tag) => tag.id !== id),
    });
  }

  async function handleSave() {
    if (!editTarget) return;

    const originalLink = getLinkById(editTarget.id);
    if (!originalLink) return;

    try {
      const editedTagIds = new Set(editTarget.tags.map((t) => t.id));

      for (const editedTag of editTarget.tags) {
        if (editedTag.id.startsWith("temp-")) {
          const existingTag = getTagByLabel(editedTag.label);
          if (existingTag) {
            const alreadyHasTag = originalLink.tags.some((t) => t.id === existingTag.id);
            if (!alreadyHasTag) {
              await addTagToLink(editTarget.id, existingTag.id);
            }
          } else {
            const newTag = await addTag(editedTag.label);
            if (newTag) {
              await addTagToLink(editTarget.id, newTag.id);
            }
          }
        } else {
          const originalTag = originalLink.tags.find((t) => t.id === editedTag.id);
          if (originalTag && originalTag.label !== editedTag.label) {
            await updateTag(editedTag.id, editedTag.label);
          }
        }
      }

      for (const originalTag of originalLink.tags) {
        if (!editedTagIds.has(originalTag.id)) {
          await removeTagFromLink(editTarget.id, originalTag.id);
        }
      }

      await updateLink(editTarget.id, {
        title: editTarget.title.substring(0, 255),
        url: editTarget.url.substring(0, 2048),
        note: editTarget.note.substring(0, 512),
        image: editTarget.image,
      });

      props.onClose();
    } catch (error) {
      console.error("Failed to save changes:", error);
      showToast("Failed to save changes. Please try again.");
    }
  }

  function handleClose() {
    props.onClose();
  }

  const modalProps = {
    isOpen: props.isOpen,
    linkId,
    url: editTarget?.url ?? "",
    title: editTarget?.title ?? "",
    tags: editTarget?.tags ?? [],
    onUrlChange: handleUrlChange,
    onTitleChange: handleTitleChange,
    onTagEdit: handleTagEdit,
    onTagDelete: handleTagDelete,
    onTagAdd: handleTagAdd,
    onSave: handleSave,
    onClose: handleClose,
  };

  return <EditLinkModal {...modalProps} />;
}
