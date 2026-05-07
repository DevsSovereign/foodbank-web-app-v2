"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function BNPLPlanChangePage() {
  const router = useRouter();

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

        <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-8">
            {/* Warning Image */}
            <div className="relative size-16 md:w-20 md:h-20">
              <Image src="/assets/warning-bnpl.png" alt="Warning" fill className="object-contain" />
            </div>

            {/* Confirmation Text */}
            <h2 className="text-[16px] md:text-[18px] font-bold text-gray-800 leading-relaxed max-w-[600px]">
              To use Buy Now, Pay Later, your account will be switched to a Flexible plan.
              Proceeding means you agree to this change.
            </h2>

            {/* Actions */}
            <div className="flex flex-row items-center justify-center gap-4 w-full max-w-[380px]">
              <button
                onClick={() => router.back()}
                className="flex-1 px-6 py-2.5 bg-[#F3F4F6] hover:bg-gray-200 text-gray-500 font-bold text-[13px] md:text-[14px] rounded-[4px] transition-all uppercase tracking-wide shadow-sm"
              >
                CANCEL
              </button>
              <button
                onClick={() => router.push("/buy-now-pay-later/bvn")}
                className="flex-1 px-6 py-2.5 bg-[#8cc629] hover:bg-[#7db424] text-white font-bold text-[13px] md:text-[14px] rounded-[4px] transition-all flex items-center justify-center gap-2 uppercase tracking-wide shadow-md group"
              >
                PROCEED
                <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
