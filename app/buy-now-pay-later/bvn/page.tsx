"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function BNPLBVNVerificationPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [bvn, setBvn] = useState("");

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // BVN is usually 11 digits
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) {
      setBvn(val);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Decorative background element */}
      <Image
        src="/assets/left.png"
        alt="decorative left-side background accent"
        width={60}
        height={350}
        className="absolute left-0 top-[35%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-[200px] w-auto object-contain opacity-50"
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        <TopRibbon />
        <Header />
        <NavBar breadcrumb="Buy Now, Pay Later" />

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 md:py-24">
          <div className="w-full max-w-[550px] flex flex-col items-center space-y-8">
            <h1 className="text-[24px] md:text-[28px] font-bold text-gray-800 text-center">
              Bank Verification Number
            </h1>

            <div className="w-full space-y-2">
              <label className="block text-[14px] font-medium text-gray-700">
                Bank Verification Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={bvn}
                onChange={handleBvnChange}
                placeholder="Enter your correct BVN number"
                className="w-full px-6 py-3.5 bg-white border border-gray-200 rounded-[8px] text-[16px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 placeholder:text-gray-400 shadow-sm"
              />
            </div>

            {/* Why Do We Need Your BVN Box */}
            <div className="w-full bg-[#f8faf6] border border-[#f0f4ec] rounded-[12px] p-6 space-y-3">
              <h3 className="text-[#8cc629] font-bold text-[16px]">Why Do We Need Your BVN?</h3>
              <p className="text-gray-600 text-[14px] leading-relaxed">
                We use your BVN to securely verify your identity and protect your account. It helps
                us confirm your full name, phone number, and date of birth to ensure safe and
                compliant access to our services.
              </p>
            </div>

            <div className="w-full pt-4">
              <button
                className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                onClick={() => {
                  if (bvn.length === 11) {
                    router.push("/buy-now-pay-later/bvn/details");
                  } else {
                    toast({ variant: "error", title: "Please enter a valid 11-digit BVN." });
                  }
                }}
              >
                Verify
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
