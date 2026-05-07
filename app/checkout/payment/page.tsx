"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Copy, Check, Home } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";

export default function PaymentPage() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [timeLeft, setTimeLeft] = useState(23 * 3600 + 56 * 60 + 17);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopRibbon />
      <Header />

      <nav className="bg-white border-b border-gray-100 py-3 relative z-10 w-full mb-8">
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

          {/* Mobile Hamburger Toggle */}
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

          {/* Right: Nav Links (Desktop) */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/categories"
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition"
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
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              Customer Support
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
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Help Center
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex-1 w-full max-w-3xl mx-auto px-4 py-8 flex flex-col items-center">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
            This account Number will expire in
          </h1>
          <div className="text-[#8cc629] text-2xl md:text-3xl font-bold font-mono tracking-widest mb-3">
            {formatTime(timeLeft)}
          </div>
          <p className="text-[13px] text-gray-600">
            Transfer only once within the given time frame, and also send the exact amount of ₦2,050
            to this account number
          </p>
        </div>

        {/* Details Card */}
        <div className="w-full max-w-[650px] bg-white border border-gray-100 shadow-sm p-8 rounded-sm mb-6">
          <div className="space-y-6">
            {/* Account Name */}
            <div className="flex justify-between items-center pb-6 border-b border-gray-100">
              <span className="text-[13px] text-gray-500 font-medium">Account Name</span>
              <span className="text-[14px] font-black text-gray-800">FOODBANK</span>
            </div>

            {/* Account Number */}
            <div>
              <span className="block text-[13px] text-gray-500 font-medium mb-1">
                Account Number
              </span>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-bold text-gray-800">9843268434</span>
                <button
                  onClick={() => handleCopy("9843268434")}
                  className="flex items-center gap-1.5 text-[#8cc629] text-xs font-bold uppercase transition hover:opacity-80"
                >
                  {isCopied ? (
                    <span className="flex items-center gap-1.5 text-[#6dbb00]">
                      Copied <Check className="size-4" />
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Copy <Copy className="size-4" />
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Bank Name */}
            <div className="pb-6 border-b border-gray-100">
              <span className="block text-[13px] text-gray-500 font-medium mb-1">Bank Name</span>
              <span className="text-[15px] font-bold text-gray-800">Paystack-Titan</span>
            </div>

            {/* Amount Structure */}
            <div className="space-y-4">
              <div>
                <span className="block text-[13px] text-gray-500 font-medium mb-1">
                  Amount Entered
                </span>
                <span className="text-[15px] font-bold text-gray-800">N2,300</span>
              </div>
              <div>
                <span className="block text-[13px] text-gray-500 font-medium mb-1">Fee</span>
                <span className="text-[15px] font-bold text-gray-800">N50</span>
              </div>
              <div>
                <span className="block text-[13px] text-gray-500 font-medium mb-1">
                  Amount to receive
                </span>
                <span className="text-[15px] font-bold text-[#8cc629]">N2,350</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="w-full max-w-[650px] flex flex-col sm:flex-row gap-4">
          <Link
            href="/checkout/success"
            className="flex-1 flex justify-center items-center bg-[#8cc629] hover:bg-[#7db424] text-white py-4 font-bold text-[12px] uppercase tracking-wider transition-colors"
          >
            I HAVE TRANSFERRED THE MONEY
          </Link>
          <button className="flex-1 bg-white hover:bg-gray-50 text-[#ff8a00] border border-[#ff8a00] border-opacity-20 py-4 font-bold text-[12px] uppercase tracking-wider transition-colors">
            WRONG AMOUNT? CHANGE AMOUNT
          </button>
        </div>
      </main>
    </div>
  );
}
