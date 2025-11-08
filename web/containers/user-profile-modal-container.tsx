"use client";

import { ChangeEvent, useRef } from "react";

import { shallow } from "zustand/shallow";

import { UserProfileModal } from "@/components";
import {
  useAuthStore,
  useLinksStore,
  useTagsStore,
  useToastStore,
} from "@/store";

type UserProfileModalContainerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function UserProfileModalContainer(
  props: UserProfileModalContainerProps
) {
  const {
    user,
    signOut: signOutUser,
    deleteAccount: deleteUserAccount,
  } = useAuthStore(
    (state) => ({
      user: state.user,
      signOut: state.signOut,
      deleteAccount: state.deleteAccount,
    }),
    shallow
  );
  const { exportLinks, importLinks } = useLinksStore(
    (state) => ({
      exportLinks: state.exportLinks,
      importLinks: state.importLinks,
    }),
    shallow
  );
  const fetchTags = useTagsStore((state) => state.fetchTags);
  const showToast = useToastStore((state) => state.showToast);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  function handleImport() {
    fileInputRef.current?.click();
  }

  async function handleImportFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      const content = await file.text();
      props.onClose();
      const importedCount = await importLinks(content);

      await fetchTags();

      if (importedCount === 0) {
        showToast("No valid links found in selected file.");
      } else {
        showToast(
          `Imported ${importedCount} link${importedCount === 1 ? "" : "s"}.`
        );
      }
    } catch (error) {
      console.error("Failed to import links", error);
      showToast("Failed to import links. Please check the file format.");
    } finally {
      event.target.value = "";
    }
  }

  async function handleExport() {
    try {
      const csvContent = await exportLinks();

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `my-pocket-links-${new Date()
        .toISOString()
        .replace(/[:.]/g, "-")}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast("Exported links successfully.");
    } catch (error) {
      console.error("Failed to export links", error);
      showToast("Failed to export links. Please try again.");
    }
  }

  async function handleLogout() {
    await signOutUser();
    props.onClose();
  }

  async function handleDeleteAccount() {
    const confirmed = confirm(
      "Are you sure you want to delete your account? This will permanently delete all your links, tags, and account data. This action cannot be undone."
    );
    if (!confirmed) {
      return;
    }

    try {
      await deleteUserAccount();
      props.onClose();
      showToast("Account deleted successfully.");
    } catch (error) {
      console.error("Failed to delete account", error);
      showToast("Failed to delete account. Please try again.");
    }
  }

  const modalProps = {
    isOpen: props.isOpen,
    onClose: props.onClose,
  };

  return (
    <>
      <UserProfileModal
        {...modalProps}
        user={
          user && user.email
            ? {
                email: user.email,
                avatar_url: user.user_metadata?.avatar_url,
                full_name: user.user_metadata?.full_name,
              }
            : null
        }
        onImport={handleImport}
        onExport={handleExport}
        onLogout={handleLogout}
        onDeleteAccount={handleDeleteAccount}
      />
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        className="hidden"
        onChange={handleImportFile}
      />
    </>
  );
}
