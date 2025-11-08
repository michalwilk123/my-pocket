"use client";

import { useToastStore } from "@/store/toast";

export function ToastContainer() {
  const toasts = useToastStore((state) => state.toasts);

  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast toast-top toast-center">
      {toasts.map((toast) => (
        <div key={toast.id} className="alert alert-success bg-white shadow-lg">
          <span className="text-sm">{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
