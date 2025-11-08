"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Download, Info, LogOut, Trash2, Upload } from "lucide-react";

import { Modal, ModalBaseProps } from "./modal";

type UserProfileModalProps = ModalBaseProps & {
  user: {
    email: string;
    avatar_url?: string;
    full_name?: string;
  } | null;
  onImport: () => void;
  onExport: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
};

export function UserProfileModal(props: UserProfileModalProps) {
  const t = useTranslations("profile");
  const {
    user,
    onImport,
    onExport,
    onLogout,
    onDeleteAccount,
    onClose,
    ...modalProps
  } = props;

  return (
    <Modal {...modalProps} onClose={onClose}>
      <div className="space-y-6">
        <div className="rounded-lg bg-base-200/60 p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              <Info className="h-5 w-5" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{t("about.heading")}</h3>
              <p className="text-sm leading-relaxed text-base-content/70">
                {t("about.description")}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-2xl font-bold">{t("heading")}</h3>
          <p className="text-sm leading-relaxed text-base-content/70">
            {t("description")}
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-lg bg-base-200 p-4">
          {user?.avatar_url ? (
            <Image
              src={user.avatar_url}
              alt={user.email ?? "User avatar"}
              width={64}
              height={64}
              className="h-16 w-16 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100 object-cover"
            />
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-content ring-2 ring-primary ring-offset-2 ring-offset-base-100">
              {user?.email?.charAt(0).toUpperCase() || "U"}
            </div>
          )}
          <div className="flex flex-col">
            {user?.full_name && (
              <span className="text-lg font-semibold">{user.full_name}</span>
            )}
            <span className="text-sm text-base-content/70">{user?.email}</span>
          </div>
        </div>

        <div className="space-y-3">
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-base-content/80">
              {t("dataManagement")}
            </h4>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <button
                  onClick={onImport}
                  className="btn btn-outline h-auto flex-col gap-2 py-4"
                  aria-label={t("import")}
                >
                  <Upload className="h-5 w-5" />
                  <span className="text-sm font-medium">{t("import")}</span>
                </button>
                <p className="text-xs text-base-content/60 text-center px-1">
                  {t("importFormat")}
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={onExport}
                  className="btn btn-outline h-auto flex-col gap-2 py-4"
                  aria-label={t("export")}
                >
                  <Download className="h-5 w-5" />
                  <span className="text-sm font-medium">{t("export")}</span>
                </button>
                <p className="text-xs text-base-content/60 text-center px-1">
                  {t("exportFormat")}
                </p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="space-y-2 pt-2">
            <h4 className="text-sm font-semibold text-base-content/80">
              {t("accountActions")}
            </h4>
            <button
              onClick={onLogout}
              className="btn btn-primary w-full gap-2"
              aria-label={t("logout")}
            >
              <LogOut className="h-4 w-4" />
              {t("logout")}
            </button>
          </div>

          <button
            onClick={onDeleteAccount}
            className="btn btn-error btn-outline w-full gap-2"
            aria-label={t("deleteAccount")}
          >
            <Trash2 className="h-4 w-4" />
            {t("deleteAccount")}
          </button>
        </div>

        <div className="rounded-lg bg-error/10 p-3">
          <p className="text-xs text-error">{t("deleteWarning")}</p>
        </div>
      </div>
    </Modal>
  );
}
