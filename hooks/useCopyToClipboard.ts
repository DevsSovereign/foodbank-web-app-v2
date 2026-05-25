"use client";

import { useCallback, useRef, useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";

interface UseCopyToClipboardOptions {
  resetMs?: number;
  successMessage?: string;
  errorMessage?: string;
  showToast?: boolean;
}

export function useCopyToClipboard(options: UseCopyToClipboardOptions = {}) {
  const [copied, setCopied] = useState<boolean>(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { toast } = useToast();

  const {
    resetMs = 2000,
    successMessage = "Copied to clipboard",
    errorMessage = "Failed to copy. Please try again.",
    showToast = true,
  } = options;

  const copy = useCallback(
    async (value: string | number) => {
      const text = String(value ?? "");

      if (!text) return false;

      try {
        if (navigator?.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
        }

        setCopied(true);
        if (showToast) toast({ variant: "success", title: successMessage });

        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetMs);

        return true;
      } catch {
        if (showToast) toast({ variant: "error", title: errorMessage });
        return false;
      }
    },
    [errorMessage, resetMs, showToast, successMessage, toast],
  );

  return { copy, copied };
}
