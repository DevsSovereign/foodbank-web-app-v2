"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { useGetCustomer } from "@/lib/queries";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useUserStore } from "@/store/useUserStore";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const {
    data: customerData,
    isLoading: customerDataLoading,
    error: customerDataError,
    refetch: refetchCustomerData,
  } = useGetCustomer();
  const { user, setUser } = useUserStore();

  const pathname = usePathname();

  const getBreadcrumb = () => {
    if (pathname === "/dashboard") return "Dashboard";
    if (pathname.includes("/notifications")) return "Notifications";
    if (pathname.includes("/order-history")) return "Order History";
    if (pathname.includes("/track-delivery")) return "Track Delivery";
    if (pathname.includes("/loan-history")) return "Loan History";
    if (pathname.includes("/card-information")) return "Card Information";
    if (pathname.includes("/repayment-history")) return "Repayment History";
    if (pathname.includes("/reward-history")) return "Reward History";
    if (pathname.includes("/account/personal-details")) return "Personal Details";
    if (pathname.includes("/account/set-pin")) return "Set up PIN";
    if (pathname.includes("/complete-profile")) return "Complete Profile";
    if (pathname.includes("/support")) return "Support";
    if (pathname.includes("/help-center")) return "Help Centre";
    if (pathname.includes("/faqs")) return "FAQs";
    return undefined;
  };

  useEffect(() => {
    if (!customerData) return;

    setUser(customerData.customer);
  }, [user, customerData, setUser]);

  if (customerDataError) {
    return <ErrorSection message={handleError(customerDataError)} onRetry={refetchCustomerData} />;
  }

  return (
    <SidebarProvider>
      {customerDataLoading ? (
        <Loader2 className="size-5 animate-spin m-4" />
      ) : !customerData ? null : (
        <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
          <Image
            src="/assets/left.png"
            alt="decorative left-side background accent"
            width={60}
            height={350}
            className="absolute left-0 top-[35%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-50 w-auto object-contain"
            priority
          />

          <div className="relative z-10 flex flex-col min-h-screen">
            <TopRibbon />
            <Header />
            <NavBar breadcrumb={getBreadcrumb()} />

            <div className="flex-1 flex flex-col md:flex-row max-w-360 w-full mx-auto relative mt-8">
              <Sidebar />
              <main className="flex-1 p-6 md:px-10 md:pb-10 md:pt-2 lg:px-10 relative z-10">
                {children}
              </main>
            </div>

            <Footer />
          </div>
        </div>
      )}
    </SidebarProvider>
  );
}
