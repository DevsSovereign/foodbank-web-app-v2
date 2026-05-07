"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function BNPLMandateAuthorizePage() {
  const { toast } = useToast();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(956); // 15 minutes and 56 seconds in total seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")} : ${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ variant: "success", title: "Copied to clipboard!" });
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
        <NavBar breadcrumb="E-Mandate > Authorize" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-10">
          <div className="w-full max-w-3xl text-center">
            <h1 className="text-[18px] md:text-[20px] font-bold text-gray-800 uppercase tracking-wide mb-6">
              E-MANDATE
            </h1>

            <div className="mb-6 md:mb-8 max-w-2xl mx-auto px-2 flex flex-wrap items-center justify-center gap-x-2">
              <p className="text-[13px] md:text-[15px] text-gray-600 leading-relaxed font-medium">
                Kindly authorize this mandate by transferring N50.00 from your GTBank.
              </p>
              <span className="text-red-500 font-mono text-[16px] md:text-[22px] font-bold whitespace-nowrap">
                00 : {formatTime(timeLeft)}
              </span>
            </div>

            <div className="bg-white border border-gray-100 rounded-[20px] md:rounded-[24px] p-6 md:p-8 shadow-sm mb-6 md:mb-8 max-w-md md:max-w-lg mx-auto text-left">
              {/* Account 1 */}
              <div className="mb-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[12px] md:text-[13px] text-gray-500 font-medium uppercase">
                    Account Number
                  </span>
                  <button
                    onClick={() => handleCopy("9843268434")}
                    className="text-[#8cc629] font-bold flex items-center hover:opacity-80 transition-opacity text-[13px]"
                  >
                    Copy <Copy className="size-3.5 ml-1" />
                  </button>
                </div>
                <p className="text-[20px] md:text-[22px] font-bold text-gray-800 mb-4 tracking-wide">
                  9843268434
                </p>
                <span className="text-[12px] md:text-[13px] text-gray-500 font-medium uppercase block mb-1">
                  Bank Name{" "}
                  <span className="text-[10px] bg-[#eff7ec] text-[#8cc629] px-2 py-0.5 rounded ml-1 normal-case font-bold">
                    Recommended
                  </span>
                </span>
                <p className="text-[15px] md:text-[17px] font-bold text-gray-800">Paystack-Titan</p>
              </div>

              {/* Separator */}
              <div className="flex items-center justify-center my-6 whitespace-nowrap">
                <div className="w-full h-[1px] bg-gray-100"></div>
                <span className="mx-4 text-gray-400 font-bold text-[12px]">OR</span>
                <div className="w-full h-[1px] bg-gray-100"></div>
              </div>

              {/* Account 2 */}
              <div className="mb-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[12px] md:text-[13px] text-gray-500 font-medium uppercase">
                    Account Number
                  </span>
                  <button
                    onClick={() => handleCopy("9843268434")}
                    className="text-[#8cc629] font-bold flex items-center hover:opacity-80 transition-opacity text-[13px]"
                  >
                    Copy <Copy className="size-3.5 ml-1" />
                  </button>
                </div>
                <p className="text-[20px] md:text-[22px] font-bold text-gray-800 mb-4 tracking-wide">
                  9843268434
                </p>
                <span className="text-[12px] md:text-[13px] text-gray-500 font-medium uppercase block mb-1">
                  Bank Name
                </span>
                <p className="text-[15px] md:text-[17px] font-bold text-gray-800">Paystack-Titan</p>
              </div>
            </div>

            {/* Note Section */}
            <div className="bg-[#fffcf8] border border-dashed border-[#ffd5a5] rounded-[12px] p-4 text-center mb-8 max-w-md md:max-w-lg mx-auto">
              <p className="text-[13px] md:text-[14px] text-gray-600 leading-relaxed px-4">
                <span className="font-bold">Note:</span> if you wish to not continue, Please click
                on the cancel button or the back icon
              </p>
            </div>

            {/* Action Button */}
            <div className="max-w-md md:max-w-lg mx-auto">
              <button
                onClick={() => router.back()}
                className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-3.5 rounded-[12px] text-[16px] transition-all shadow-md uppercase tracking-wide"
              >
                Cancel
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
