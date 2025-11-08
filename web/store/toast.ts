import { createWithEqualityFn } from "zustand/traditional";

type Toast = {
  id: string;
  message: string;
};

type ToastStore = {
  toasts: Toast[];
  showToast: (message: string) => void;
  removeToast: (id: string) => void;
};

export const useToastStore = createWithEqualityFn<ToastStore>()((set) => ({
  toasts: [],
  showToast: (message: string) => {
    const id = Math.random().toString(36).substring(7);
    set((state) => ({
      toasts: [...state.toasts, { id, message }],
    }));
    setTimeout(() => {
      set((state) => ({
        toasts: state.toasts.filter((toast) => toast.id !== id),
      }));
    }, 2000);
  },
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },
}));
