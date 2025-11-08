"use client";

import {
  Activity,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { createPortal } from "react-dom";

import {
  AddLinkModalContainer,
  ConfirmDeleteModalContainer,
  EditLinkModalContainer,
  UserProfileModalContainer,
} from "@/containers";

export enum Modals {
  AddLink = "AddLink",
  EditLink = "EditLink",
  ConfirmDelete = "ConfirmDelete",
  UserProfile = "UserProfile",
}

type ModalPropsMap = {
  [Modals.AddLink]: Record<string, never>;
  [Modals.EditLink]: { linkId: string };
  [Modals.ConfirmDelete]: { linkId: string };
  [Modals.UserProfile]: Record<string, never>;
};

type InternalState =
  | { type: null; props: undefined }
  | { type: Modals.AddLink; props: ModalPropsMap[Modals.AddLink] }
  | { type: Modals.EditLink; props: ModalPropsMap[Modals.EditLink] }
  | { type: Modals.ConfirmDelete; props: ModalPropsMap[Modals.ConfirmDelete] }
  | { type: Modals.UserProfile; props: ModalPropsMap[Modals.UserProfile] };

type ModalContextValue = {
  showModal: <T extends Modals>(type: T, props: ModalPropsMap[T]) => void;
  closeModal: () => void;
  activeModal: Modals | null;
};

const ModalContext = createContext<ModalContextValue | null>(null);

const MODAL_ROOT_ID = "mypocket-modal-root";

export function ModalManagerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<InternalState>({
    type: null,
    props: undefined,
  });
  const [modalRoot, setModalRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById(MODAL_ROOT_ID);
    if (!(root instanceof HTMLElement)) {
      throw new Error(
        `Modal root element with id "${MODAL_ROOT_ID}" is not an HTMLElement.`
      );
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setModalRoot(root);
  }, []);

  const showModal = useCallback(
    <T extends Modals>(type: T, props: ModalPropsMap[T]) => {
      setState({ type, props } as InternalState);
    },
    []
  );

  const closeModal = useCallback(() => {
    setState({ type: null, props: undefined });
  }, []);

  const value = useMemo<ModalContextValue>(
    () => ({
      showModal,
      closeModal,
      activeModal: state.type,
    }),
    [showModal, closeModal, state.type]
  );

  const modalContent = useMemo(() => {
    if (!state.type) {
      return null;
    }

    switch (state.type) {
      case Modals.AddLink:
        return <AddLinkModalContainer isOpen={true} onClose={closeModal} />;
      case Modals.EditLink:
        return (
          <EditLinkModalContainer
            isOpen={true}
            linkId={(state.props as ModalPropsMap[Modals.EditLink]).linkId}
            onClose={closeModal}
          />
        );
      case Modals.ConfirmDelete:
        return (
          <ConfirmDeleteModalContainer
            isOpen={true}
            linkId={(state.props as ModalPropsMap[Modals.ConfirmDelete]).linkId}
            onClose={closeModal}
          />
        );
      case Modals.UserProfile:
        return <UserProfileModalContainer isOpen={true} onClose={closeModal} />;
      default:
        throw new Error(`Unknown modal type: ${state}`);
    }
  }, [state, closeModal]);

  return (
    <ModalContext.Provider value={value}>
      {children}
      {modalRoot &&
        createPortal(
          <Activity mode={modalContent ? "visible" : "hidden"}>
            {modalContent}
          </Activity>,
          modalRoot
        )}
    </ModalContext.Provider>
  );
}

export function useModals() {
  const ctx = useContext(ModalContext);
  if (!ctx) {
    throw new Error("useModals must be used within ModalManagerProvider");
  }
  return ctx;
}
