"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { CheckCircle2, CircleAlert, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ToastVariant = "success" | "error" | "info";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  pushToast: (toast: Omit<ToastItem, "id">) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

function variantStyles(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return "border-border bg-card text-foreground";
    case "error":
      return "border-destructive/40 bg-card text-foreground";
    default:
      return "border-border bg-card text-foreground";
  }
}

function variantIcon(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return <CheckCircle2 className="h-4 w-4" />;
    case "error":
      return <CircleAlert className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const pushToast = (toast: Omit<ToastItem, "id">) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setToasts((current) => [{ ...toast, id }, ...current].slice(0, 5));
  };

  useEffect(() => {
    if (toasts.length === 0) {
      return;
    }

    const timers = toasts.map((toast) =>
      window.setTimeout(() => {
        setToasts((current) => current.filter((item) => item.id !== toast.id));
      }, 3600)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts]);

  const value = useMemo(() => ({ pushToast }), []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[100] flex justify-center px-4">
        <div className="flex w-full max-w-lg flex-col gap-3">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 rounded-2xl border px-4 py-3 ${variantStyles(toast.variant)}`}
            >
              <div className="mt-0.5">{variantIcon(toast.variant)}</div>
              <div className="flex-1">
                <p className="text-sm font-semibold">{toast.title}</p>
                {toast.description ? (
                  <p className="mt-1 text-sm text-muted-foreground">{toast.description}</p>
                ) : null}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                onClick={() => setToasts((current) => current.filter((item) => item.id !== toast.id))}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return context;
}
