"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToastProvider from "@/components/ui/toast/ToastProvider";
import useScrollToTop from "@/hooks/useScrollToTop";
import { ReactNode } from "react";
import CustomerDataProvider from "./CustomerData";

const queryClient = new QueryClient();

export default function ClientProvider({ children }: { children: ReactNode }) {
  // always scroll to top on route change
  useScrollToTop();

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <CustomerDataProvider>{children}</CustomerDataProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
