"use client";

import { Tag } from "@/lib/models";

import { LinkDetailsModal } from "./link-details-modal";

type AddLinkModalProps = {
  isOpen: boolean;
  url: string;
  title: string;
  tags: Tag[];
  isSaving?: boolean;
  onUrlChange: (url: string) => void;
  onTitleChange: (title: string) => void;
  onTagEdit: (id: string, newLabel: string) => void;
  onTagDelete: (id: string) => void;
  onTagAdd: (label: string) => void;
  onSave: () => void;
  onClose: () => void;
};

export function AddLinkModal(props: AddLinkModalProps) {
  return (
    <LinkDetailsModal
      isOpen={props.isOpen}
      idPrefix="add"
      heading="Save a URL"
      description="Fill in the details to save a new link to your collection."
      submitLabel="Save link"
      url={props.url}
      title={props.title}
      tags={props.tags}
      isSaving={props.isSaving}
      onUrlChange={props.onUrlChange}
      onTitleChange={props.onTitleChange}
      onTagEdit={props.onTagEdit}
      onTagDelete={props.onTagDelete}
      onTagAdd={props.onTagAdd}
      onSave={props.onSave}
      onClose={props.onClose}
    />
  );
}
