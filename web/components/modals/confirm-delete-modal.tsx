"use client";

import { useTranslations } from "next-intl";

import { Modal, ModalBaseProps } from "./modal";

type ConfirmDeleteModalProps = ModalBaseProps & {
  linkTitle: string;
  onConfirm: () => void;
};

export function ConfirmDeleteModal(props: ConfirmDeleteModalProps) {
  const t = useTranslations("deleteModal");
  const { linkTitle, onConfirm, onClose, ...modalProps } = props;

  return (
    <Modal {...modalProps} onClose={onClose}>
      <div>
        <h3 className="text-xl font-bold">{t("heading")}</h3>
        <p className="mt-3 text-sm leading-relaxed text-base-content/70">
          {t("description")} &ldquo;{linkTitle}&rdquo;?
        </p>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            aria-label={t("cancelButton")}
            className="btn btn-outline flex-1"
          >
            {t("cancelButton")}
          </button>
          <button
            onClick={onConfirm}
            aria-label={t("confirmButton")}
            className="btn btn-error flex-1"
          >
            {t("confirmButton")}
          </button>
        </div>
      </div>
    </Modal>
  );
}
