"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "./SidebarContext";
import {
  User,
  Bell,
  FileText,
  Clock,
  Truck,
  // CreditCard,
  // RotateCcw,
  // Gift,
  HelpCircle,
  LifeBuoy,
  HeadphonesIcon,
  LogOut,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  X,
  Menu,
} from "lucide-react";
import { clearAuthToken } from "@/lib/auth-utils";
import { useUserStore } from "@/store/useUserStore";
import { getGreeting } from "../functions/greetings";
import { useQueryClient } from "@tanstack/react-query";

export default function Sidebar() {
  const [isAccountOpen, setIsAccountOpen] = useState(false);
  const { isMobileSidebarOpen, closeMobileSidebar, toggleMobileSidebar } = useSidebar();
  const pathname = usePathname();
  const { user, clearUserStore } = useUserStore();
  const queryClient = useQueryClient()

  // Derive display name from email (before the @)
  const displayName = user?.firstName || user?.email?.split("@")[0] || "User";

  const isActive = (path: string) => pathname?.startsWith(path);

  const handleLogout = async () => {
    if (typeof window === "undefined") return;

    await queryClient.cancelQueries();
    queryClient.clear();
    clearAuthToken();
    clearUserStore();
    window.location.href = "/";
  };

  return (
    <>
      {/* Mobile Floating Toggle Button */}
      {!isMobileSidebarOpen && (
        <button
          onClick={toggleMobileSidebar}
          className="md:hidden fixed bottom-6 right-6 z-50 size-14 bg-[#8cc629] text-white rounded-full shadow-lg flex items-center justify-center hover:bg-[#7db424] transition-colors"
          aria-label="Open Menu"
        >
          <Menu size={24} />
        </button>
      )}

      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity"
          onClick={closeMobileSidebar}
        />
      )}

      <aside
        onClick={closeMobileSidebar}
        className={`
        fixed md:relative md:self-start inset-y-0 left-0 z-50 md:z-10
        w-70 md:w-72 
        bg-white border-r md:border border-gray-200 md:rounded-xl 
        flex flex-col overflow-y-auto scrollbar-hide
        transition-transform duration-300 ease-in-out
        ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        md:mb-8 md:ml-4
      `}
      >
        <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-100">
          <Image
            src="/assets/foodbank-logo-4-1.png"
            alt="FoodBank"
            width={120}
            height={30}
            className="object-contain"
          />
          <button
            onClick={closeMobileSidebar}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          <div className="bg-[#8cc629] rounded-xl p-4 flex items-center gap-3 text-white">
            <div className="size-14 relative shrink-0">
              <Image
                src="/assets/frame-4580.png"
                alt="User Avatar"
                fill
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-sm opacity-90">{getGreeting()},</p>
              <p className="font-semibold">{displayName}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 pb-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                {isActive("/dashboard") ? (
                  <Image
                    src="/assets/stack-2.png"
                    alt="Dashboard"
                    width={20}
                    height={20}
                    className="opacity-100"
                    style={{
                      filter:
                        "brightness(0) saturate(100%) invert(64%) sepia(85%) saturate(1063%) hue-rotate(42deg) brightness(98%) contrast(90%)",
                    }}
                  />
                ) : (
                  <LayoutDashboard size={20} />
                )}
                <span className="font-medium">Dashboard</span>
              </Link>
            </li>

            <li className="rounded-lg overflow-hidden">
              <div
                className="flex items-center justify-between px-3 py-2.5 text-gray-600 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => setIsAccountOpen(!isAccountOpen)}
              >
                <div className="flex items-center gap-3">
                  <User size={20} />
                  <span className="font-medium">Account</span>
                </div>
                {isAccountOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </div>

              {isAccountOpen && (
                <ul className="py-1 bg-gray-50/50">
                  <li>
                    <Link
                      href="/dashboard/account/personal-details"
                      className={`block px-11 py-2 text-sm transition-colors ${
                        isActive("/dashboard/account/personal-details")
                          ? "text-[#8cc629] font-medium border-l-2 border-[#8cc629]"
                          : "text-gray-600 hover:text-[#8cc629]"
                      }`}
                    >
                      Personal Details
                    </Link>
                  </li>
                  {/* <li>
                    <Link
                      href="/dashboard/account/personal-details#job-information"
                      className="block px-11 py-2 text-sm text-gray-600 hover:text-[#8cc629] border-l-2 border-transparent"
                    >
                      Job Information
                    </Link>
                  </li> */}
                  {user?.accountType === "flexible" && (
                    <>
                      <li>
                        <Link
                          href="/dashboard/account/personal-details#bvn-information"
                          className="block px-11 py-2 text-sm text-gray-600 hover:text-[#8cc629] border-l-2 border-transparent"
                        >
                          BVN Information
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/dashboard/account/personal-details#virtual-account"
                          className="block px-11 py-2 text-sm text-gray-600 hover:text-[#8cc629] border-l-2 border-transparent"
                        >
                          Virtual Account
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              )}
            </li>

            <li>
              <Link
                href="/dashboard/notifications"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/notifications")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Bell size={20} />
                <span className="font-medium">Notifications</span>
              </Link>
            </li>
            <li>
              <Link
                href="/terms"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/terms") && !isActive("/dashboard/terms-and-conditions")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText size={20} />
                <span className="font-medium">Terms and Conditions</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/order-history"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/order-history")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Clock size={20} />
                <span className="font-medium">Order History</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/track-delivery"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/track-delivery")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Truck size={20} />
                <span className="font-medium">Track Delivery</span>
              </Link>
            </li>
            {/* <li>
              <Link
                href="/dashboard/loan-history"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/loan-history")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard size={20} />
                <span className="font-medium">Loan History</span>
              </Link>
            </li> */}
            {/* <li>
              <Link
                href="/dashboard/card-information"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/card-information")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <CreditCard size={20} />
                <span className="font-medium">Card Information</span>
              </Link>
            </li> */}
            {/* <li>
              <Link
                href="/dashboard/repayment-history"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/repayment-history")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <RotateCcw size={20} />
                <span className="font-medium">Repayment History</span>
              </Link>
            </li> */}
            {/* <li>
              <Link
                href="/dashboard/reward-history"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/reward-history")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Gift size={20} />
                <span className="font-medium">Reward History</span>
              </Link>
            </li> */}
            <li>
              <Link
                href="/dashboard/faqs"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/faqs")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <HelpCircle size={20} />
                <span className="font-medium">FAQs</span>
              </Link>
            </li>
          </ul>

          <div className="mt-8 mb-2 px-3">
            <h3 className="text-xs font-bold text-[#8cc629] uppercase tracking-wider">
              Report a problem
            </h3>
          </div>
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard/help-center"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/help-center")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <LifeBuoy size={20} />
                <span className="font-medium">Help Centre</span>
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/support"
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive("/dashboard/support")
                    ? "bg-[#f0f7e6] text-[#8cc629]"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <HeadphonesIcon size={20} />
                <span className="font-medium">Support</span>
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors font-medium"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
