"use client";

import {
  ToastProvider,
  ToastViewport,
  ToastContent,
} from "@/components/ui/toast";
import { useToast } from "@/hooks/use-toast";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function (toast) {
        return (
          <ToastContent
            key={toast.id}
            variant={toast.variant}
            title={toast.title}
            description={toast.description}
            action={toast.action}
            {...toast}
          />
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}