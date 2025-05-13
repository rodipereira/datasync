
import { useState } from "react";

export type ToastType = "default" | "destructive";

export type Toast = {
  id: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
  variant?: ToastType;
};

export type ToastActionElement = React.ReactElement;

const toasts: Toast[] = [];

export function useToast() {
  const [toastState, setToasts] = useState<Toast[]>([]);

  function toast({ title, description, action, variant }: Omit<Toast, "id">) {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { id, title, description, action, variant };
    setToasts((toasts) => [...toasts, newToast]);
    return id;
  }

  return {
    toast,
    toasts: toastState,
  };
}

// Create a default toast function that can be imported directly
const toast = ({ title, description, action, variant }: Omit<Toast, "id">) => {
  // This is just a placeholder that will be properly initialized in a React component context
  console.warn("Toast called outside of component context");
  return "";
};

export { toast };
