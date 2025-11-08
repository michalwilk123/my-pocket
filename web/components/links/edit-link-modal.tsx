"use client";

import { Tag } from "@/lib/models";

import { LinkDetailsModal } from "./link-details-modal";

type EditLinkModalProps = {
  isOpen: boolean;
  linkId: string;
  url: string;
  title: string;
  tags: Tag[];
  onUrlChange: (url: string) => void;
  onTitleChange: (title: string) => void;
  onTagEdit: (id: string, newLabel: string) => void;
  onTagDelete: (id: string) => void;
  onTagAdd: (label: string) => void;
  onSave: () => void;
  onClose: () => void;
};

export function EditLinkModal(props: EditLinkModalProps) {
  return (
    <LinkDetailsModal
      isOpen={props.isOpen}
      idPrefix="edit"
      heading="Update details"
      description="Modify the link information and press Enter or click Save to update."
      submitLabel="Save changes"
      url={props.url}
      title={props.title}
      tags={props.tags}
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
