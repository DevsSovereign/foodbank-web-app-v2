/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import {
  Home,
  AlignLeft,
  ChevronDown,
  UtensilsCrossed,
  Headset,
  Info,
  X,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useSidebar } from "../layout/SidebarContext";
import CategoryDropdown from "../layout/CategoryDropdown";

export default function NavBar({ breadcrumb }: { breadcrumb?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  let toggleMobileSidebar: (() => void) | undefined;

  try {
    const sidebarContext = useSidebar();
    toggleMobileSidebar = sidebarContext.toggleMobileSidebar;
  } catch {
    toggleMobileSidebar = undefined;
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between md:justify-center h-12 gap-6 md:gap-10">
          <div className="flex items-center gap-1.5">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#6cc200] transition font-medium"
            >
              <Home className="size-4" />
              Home
            </Link>
            {breadcrumb && (
              <>
                <ChevronRight className="size-3 text-gray-400" />
                <span className="text-xs text-gray-900 font-medium">{breadcrumb}</span>
              </>
            )}
          </div>

          <CategoryDropdown triggerStyle="navbar" />

          {/* <Link
            href="#"
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#6cc200] transition font-medium"
          >
            <UtensilsCrossed className="size-4" />
            Food Order
          </Link> */}

          <Link
            href="/dashboard/support"
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#6cc200] transition font-medium"
          >
            <Headset className="size-4" />
            Customer Support
          </Link>

          <Link
            href="/dashboard/help-center"
            className="hidden md:flex items-center gap-1.5 text-xs text-gray-600 hover:text-[#6cc200] transition font-medium"
          >
            <Info className="size-4" />
            Help Center
          </Link>

          <button
            className="md:hidden ml-auto text-gray-600 cursor-pointer"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Image src="/assets/mage_filter.svg" alt="Menu" width={24} height={24} />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 space-y-3">
          {/* <Link
            href="#"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
          >
            <UtensilsCrossed className="size-4" /> Food Order
          </Link> */}
          <Link
            href="/dashboard/support"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
          >
            <Headset className="size-4" /> Customer Support
          </Link>
          <Link
            href="/dashboard/help-center"
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
          >
            <Info className="size-4" /> Help Center
          </Link>
        </div>
      )}
    </nav>
  );
}
