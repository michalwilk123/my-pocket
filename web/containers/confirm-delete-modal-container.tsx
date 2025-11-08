"use client";

import { useMemo } from "react";

import { shallow } from "zustand/shallow";

import { ConfirmDeleteModal } from "@/components";
import { useLinksStore } from "@/store";

type ConfirmDeleteModalContainerProps = {
  isOpen: boolean;
  linkId: string;
  onClose: () => void;
};

export function ConfirmDeleteModalContainer(
  props: ConfirmDeleteModalContainerProps
) {
  const { getLinkById, removeLink } = useLinksStore(
    (state) => ({
      getLinkById: state.getLinkById,
      removeLink: state.removeLink,
    }),
    shallow
  );

  const linkTitle = useMemo(() => {
    if (!props.linkId) return "";
    return getLinkById(props.linkId)?.title ?? "";
  }, [props.linkId, getLinkById]);

  async function handleConfirm() {
    if (!props.linkId) return;
    await removeLink(props.linkId);
    props.onClose();
  }

  function handleCancel() {
    props.onClose();
  }

  const modalProps = {
    isOpen: props.isOpen,
    onClose: handleCancel,
  };

  return (
    <ConfirmDeleteModal
      {...modalProps}
      linkTitle={linkTitle}
      onConfirm={handleConfirm}
    />
  );
}
