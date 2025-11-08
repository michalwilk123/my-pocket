"use client";

import { Activity, useEffect } from "react";

import { X } from "lucide-react";

export type ModalBaseProps = {
  isOpen: boolean;
  onClose: () => void;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
};

type ModalProps = ModalBaseProps & {
  children: React.ReactNode;
};

export function Modal({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
}: ModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && closeOnEscape) {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, closeOnEscape]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose();
    }
  }

  return (
    <Activity mode={isOpen ? "visible" : "hidden"}>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={handleBackdropClick}
        role="dialog"
        aria-modal="true"
      >
        <div
          className="relative w-full max-w-xl rounded-2xl bg-base-100 p-6 shadow-xl md:p-7 lg:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="btn btn-circle btn-ghost btn-sm absolute right-4 top-4"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          {children}
        </div>
      </div>
    </Activity>
  );
}
