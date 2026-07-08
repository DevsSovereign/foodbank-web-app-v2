"use client";

import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import { TAWK_SRC } from "@/lib/config";

const TAWK_SCRIPT_ID = "tawk-to-script";

export default function TawkWidget() {
  const { user } = useUserStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (document.getElementById(TAWK_SCRIPT_ID)) {
      window.Tawk_API?.showWidget?.();
      return;
    }

    // Prefill visitor identity BEFORE the embed loads (only if we have a user).
    if (user) {
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_API.visitor = { name: fullName || user.email, email: user.email };
    }
    window.Tawk_LoadStart = new Date();

    const script = document.createElement("script");
    script.id = TAWK_SCRIPT_ID;
    script.async = true;
    script.src = TAWK_SRC;
    script.charset = "UTF-8";
    script.setAttribute("crossorigin", "*");
    document.body.appendChild(script);
    window.Tawk_API?.showWidget?.();
  }, [user]);

  return null;
}
