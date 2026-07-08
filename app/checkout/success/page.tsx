"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Home, ArrowRight } from "lucide-react";
import { useSupportChat } from "@/hooks/useSupportChat";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";

export default function OrderSuccessPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { open: openSupport, isLoggedIn } = useSupportChat();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopRibbon />
      <Header />

      <nav className="bg-white border-b border-gray-100 py-3 relative z-10 w-full mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-sm font-medium flex items-center gap-2 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-[#6cc200] transition"
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-800">Cart</span>
          </div>

          <button
            className="md:hidden text-gray-600 p-1"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileNavOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12v0M4 6v0M4 18v0M8 12h12M8 6h12M8 18h12" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/categories"
              className="flex items-center gap-1.5 bg-white border border-gray-100 shadow-sm text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition"
            >
              <span className="text-gray-800">All Category</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link>

            <Link
              href="#"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Track Order
            </Link>

            {isLoggedIn && (
              <button
                type="button"
                onClick={openSupport}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                  <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
                </svg>
                Customer Support
              </button>
            )}

            {/* <Link
              href="#"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Help Center
            </Link> */}
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full flex flex-col items-center justify-center px-4 py-12 md:py-20 mb-20 text-center">
        <div className="relative size-24 md:w-[124px] md:h-[124px] mb-8">
          <Image
            src="/assets/checkcircle-2.png"
            alt="Success Check"
            fill
            className="object-contain"
          />
        </div>

        <h1 className="text-[22px] md:text-[28px] font-bold text-gray-900 mb-4 tracking-tight">
          Your order is successfully placed
        </h1>

        <p className="text-[13px] md:text-[14px] text-gray-500 max-w-[460px] mx-auto leading-relaxed mb-10">
          Congratulations , you have successfully placed your order
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 bg-white text-[#8cc629] border border-[#d3e9b1] px-8 py-3.5 rounded-sm font-bold text-[13px] tracking-wide hover:bg-[#f4faee] transition-colors w-full sm:w-auto"
          >
            <Home className="size-4" />
            GO TO DASHBOARD
          </Link>

          <Link
            href="/orders"
            className="flex items-center justify-center gap-2 bg-[#8cc629] text-white px-8 py-[15px] rounded-sm font-bold text-[13px] tracking-wide hover:bg-[#7db424] transition-colors w-full sm:w-auto"
          >
            VIEW ORDER <ArrowRight className="size-4 ml-1" />
          </Link>
        </div>
      </main>

      <div className="h-48 bg-black w-full mt-auto"></div>
    </div>
  );
}
