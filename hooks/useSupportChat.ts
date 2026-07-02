"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/useUserStore";
import { openTawkChat } from "@/lib/tawk";

export function useSupportChat() {
  const router = useRouter();
  const { user } = useUserStore();

  return useCallback(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    openTawkChat();
  }, [user, router]);
}
