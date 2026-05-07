"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "@/components/ui/toast/ToastProvider";
import useScrollToTop from "@/hooks/useScrollToTop";

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // always scroll to top on route change
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>{children}</ToastProvider>
    </QueryClientProvider>
  );
}
