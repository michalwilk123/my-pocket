"use client";

import { useEffect, useRef } from "react";

import { useTranslations } from "next-intl";

import { Modal } from "@/components/modals/modal";
import { EditableTagGroup } from "@/components/tags/editable-tag-group";
import { Tag } from "@/lib/models";

type LinkDetailsModalProps = {
  isOpen: boolean;
  idPrefix: string;
  heading: string;
  description: string;
  submitLabel: string;
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

export function LinkDetailsModal(props: LinkDetailsModalProps) {
  const t = useTranslations();
  const headingId = `${props.idPrefix}-heading`;
  const descriptionId = `${props.idPrefix}-description`;
  const urlInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (props.isOpen && urlInputRef.current) {
      urlInputRef.current.focus();
    }
  }, [props.isOpen]);

  return (
    <Modal
      isOpen={props.isOpen}
      onClose={props.onClose}
      showCloseButton={true}
      closeOnBackdropClick={true}
      closeOnEscape={true}
    >
      <>
        <div className="space-y-2">
          <h3 id={headingId} className="text-2xl font-bold">
            {props.heading}
          </h3>
          <p
            id={descriptionId}
            className="text-sm leading-relaxed text-base-content/70"
          >
            {props.description}
          </p>
        </div>

        <form
          aria-labelledby={headingId}
          aria-describedby={descriptionId}
          className="mt-6 space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            props.onSave();
          }}
        >
          <label className="form-control w-full flex flex-row gap-2">
            <div className="label">
              <span className="label-text text-sm font-semibold">
                {t("addModal.urlLabel")}
              </span>
            </div>
            <input
              ref={urlInputRef}
              id={`${props.idPrefix}-url`}
              type="url"
              value={props.url}
              onChange={(e) => props.onUrlChange(e.target.value)}
              required
              aria-required="true"
              maxLength={2048}
              className="input input-bordered h-8 text-small ml-2 bg-white w-full p-5"
              placeholder={t("addModal.urlPlaceholder")}
            />
          </label>

          <div className="form-control mt-5">
            <EditableTagGroup
              tags={props.tags}
              onTagEdit={props.onTagEdit}
              onTagDelete={props.onTagDelete}
              onTagAdd={props.onTagAdd}
              idPrefix={props.idPrefix}
            />
          </div>

          <label className="form-control">
            <div className="label pb-1.5">
              <span className="label-text text-xs font-medium text-base-content/60">
                {t("addModal.titleLabel")}
              </span>
            </div>
            <input
              id={`${props.idPrefix}-title`}
              type="text"
              value={props.title}
              onChange={(e) => props.onTitleChange(e.target.value)}
              maxLength={255}
              className="input input-bordered h-6 text-xs ml-2 bg-white"
              placeholder={t("addModal.titlePlaceholder")}
            />
          </label>

          <button
            type="submit"
            disabled={props.isSaving}
            aria-label={props.submitLabel}
            className="btn btn-primary mt-4 h-12 w-full gap-2 text-base font-semibold"
          >
            {props.isSaving ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                {t("addModal.saving")}
              </>
            ) : (
              props.submitLabel
            )}
          </button>
        </form>
      </>
    </Modal>
  );
}
