"use client";

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";

type ToastVariant = "success" | "error" | "info";

export interface ToastInput {
  title: string;
  description?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastItem extends Required<Pick<ToastInput, "title" | "variant" | "durationMs">> {
  id: string;
  description?: string;
}

interface ToastContextValue {
  toast: (input: ToastInput) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}

function getAccent(variant: ToastVariant) {
  switch (variant) {
    case "success":
      return {
        ring: "ring-[#8cc629]/25",
        dot: "bg-[#8cc629]",
        title: "text-gray-900",
      };
    case "error":
      return {
        ring: "ring-red-500/20",
        dot: "bg-red-500",
        title: "text-gray-900",
      };
    case "info":
    default:
      return {
        ring: "ring-gray-900/10",
        dot: "bg-gray-400",
        title: "text-gray-900",
      };
  }
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, number>>(new Map());

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timersRef.current.get(id);
    if (timer) {
      window.clearTimeout(timer);
      timersRef.current.delete(id);
    }
  }, []);

  const toast = useCallback(
    (input: ToastInput) => {
      const id = `${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const item: ToastItem = {
        id,
        title: input.title,
        description: input.description,
        variant: input.variant ?? "info",
        durationMs: input.durationMs ?? 2600,
      };

      setToasts((prev) => [item, ...prev].slice(0, 3));

      const timer = window.setTimeout(() => remove(id), item.durationMs);
      timersRef.current.set(id, timer);
    },
    [remove],
  );

  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-4 right-4 z-200 flex w-[min(380px,calc(100vw-2rem))] flex-col gap-3">
        {toasts.map((t) => {
          const accent = getAccent(t.variant);
          return (
            <div
              key={t.id}
              className={`bg-white/95 backdrop-blur border border-gray-100 shadow-[0_10px_30px_rgba(0,0,0,0.08)] rounded-xl p-4 ring-1 ${accent.ring}`}
              role="status"
              aria-live="polite"
            >
              <div className="flex items-start gap-3">
                <div className={`${accent.dot} mt-1.5 size-2.5 rounded-full shrink-0`} />
                <div className="min-w-0 flex-1">
                  <p className={`text-sm font-bold ${accent.title}`}>{t.title}</p>
                  {t.description ? (
                    <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t.description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={() => remove(t.id)}
                  className="text-gray-400 hover:text-gray-600 transition-colors -mt-1 -mr-1 px-2 py-1 rounded"
                  aria-label="Dismiss notification"
                >
                  ×
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
