import { ReactNode } from "react";

import { createWithEqualityFn } from "zustand/traditional";

type ModalConfig = {
  showCloseButton: boolean;
  closeOnBackdropClick: boolean;
  closeOnEscape: boolean;
};

type ModalState = {
  isOpen: boolean;
  content: ReactNode | null;
  config: ModalConfig;
  openModal: (content: ReactNode, config?: Partial<ModalConfig>) => void;
  closeModal: () => void;
};

const defaultConfig: ModalConfig = {
  showCloseButton: true,
  closeOnBackdropClick: true,
  closeOnEscape: true,
};

export const useModalStore = createWithEqualityFn<ModalState>()((set) => ({
  isOpen: false,
  content: null,
  config: defaultConfig,

  openModal: (content: ReactNode, config?: Partial<ModalConfig>) => {
    if (!content) return;

    set({
      isOpen: true,
      content,
      config: { ...defaultConfig, ...config },
    });
  },

  closeModal: () => {
    set({
      isOpen: false,
      content: null,
      config: defaultConfig,
    });
  },
}));
