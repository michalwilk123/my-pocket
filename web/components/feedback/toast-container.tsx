"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { useToastStore } from "@/store/toast";

const TOAST_ROOT_ID = "mypocket-toast-root";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);
  const [toastRoot, setToastRoot] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const root = document.getElementById(TOAST_ROOT_ID);
    if (!(root instanceof HTMLElement)) {
      throw new Error(
        `Toast root element with id "${TOAST_ROOT_ID}" is not an HTMLElement.`
      );
    }
    setToastRoot(root);
  }, []);

  if (toasts.length === 0 || !toastRoot) {
    return null;
  }

  return createPortal(
    <div className="toast toast-bottom toast-end z-50">
      {toasts.map((toast) => (
        <div key={toast.id} className="alert alert-success bg-white shadow-lg">
          <span className="text-sm">{toast.message}</span>
        </div>
      ))}
    </div>,
    toastRoot
  );
}
