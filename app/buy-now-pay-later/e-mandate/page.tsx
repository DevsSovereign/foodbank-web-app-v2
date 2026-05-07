"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function BNPLMandatePage() {
  const router = useRouter();
  const [selectedBank, setSelectedBank] = useState("gtbank");

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
        <NavBar breadcrumb="E-Mandate" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-10">
          <div className="w-full max-w-3xl">
            <div className="mb-6 md:mb-8 text-center md:text-left">
              <h1 className="hidden md:block text-[18px] md:text-[20px] font-bold text-gray-800 uppercase tracking-wide mb-1">
                E-MANDATE
              </h1>
              <div className="md:bg-transparent bg-[#eff7ec] p-4 md:p-0 rounded-[12px]">
                <p className="text-[16px] md:text-[15px] text-gray-700 md:text-gray-600 font-bold md:font-medium">
                  Bank Option For E-Mandate
                </p>
                <p className="text-[14px] md:text-[13px] text-gray-600 md:text-gray-500 mt-1 max-w-2xl leading-relaxed md:leading-normal">
                  Please note that this action will be triggered only if you fail to make your
                  monthly payment when it is overdue.
                </p>
              </div>
            </div>

            <div className="bg-white md:border md:border-gray-100 md:rounded-[20px] md:rounded-[24px] md:p-8 md:shadow-sm mb-8 max-w-xl mx-auto md:mx-0">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-[14px] md:text-[15px] font-semibold text-gray-700">
                  Add or Select Bank for E-Mandate Debit
                </h2>
                <button className="text-[#8cc629] font-bold flex items-center hover:opacity-80 transition-opacity text-[13px] md:text-[14px]">
                  Add <ChevronRight className="size-4 ml-1" />
                </button>
              </div>

              {/* Bank Selection List */}
              <div className="space-y-4 mb-8 md:mb-10">
                <div
                  onClick={() => setSelectedBank("gtbank")}
                  className={`border rounded-[12px] md:rounded-[16px] p-4 md:p-6 flex items-center justify-between cursor-pointer transition-all ${
                    selectedBank === "gtbank"
                      ? "border-[#8cc629] bg-[#fdfdfd] shadow-sm"
                      : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <div>
                    <h3 className="text-[16px] md:text-[17px] font-bold text-gray-800">GTBank</h3>
                    <p className="text-[13px] md:text-[14px] text-gray-500 tracking-[0.2em]">
                      746*******763
                    </p>
                  </div>
                  <div
                    className={`size-5 md:w-5.5 md:h-5.5 rounded-full border-2 flex items-center justify-center ${
                      selectedBank === "gtbank" ? "border-[#8cc629]" : "border-gray-200"
                    }`}
                  >
                    {selectedBank === "gtbank" && (
                      <div className="size-2.5 md:w-3 md:h-3 rounded-full bg-[#8cc629]"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Note Section */}
              <div className="bg-[#fffcf8] border border-dashed border-[#ffd5a5] rounded-[12px] p-4 text-center mb-8 md:mb-10">
                <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed">
                  <span className="font-bold">Note:</span> if you wish to not continue, Please click
                  on the cancel button or the back icon
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => router.back()}
                  className="w-full bg-[#b3b3b3] md:bg-transparent md:border md:border-gray-200 text-white md:text-gray-600 font-bold py-3.5 rounded-[12px] text-[15px] md:text-[16px] md:hover:bg-gray-50 transition-all uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => router.push("/buy-now-pay-later/e-mandate/authorize")}
                  className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-3.5 rounded-[12px] text-[15px] md:text-[16px] transition-all shadow-md uppercase"
                >
                  Complete
                </button>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
