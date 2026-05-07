"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function BNPLEmailVerificationPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(195); // 03:15 = 195 seconds

  useEffect(() => {
    if (timeLeft <= 0) return;
    const timerId = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 4) {
      setOtp(val);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      {/* Decorative background elements */}
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
          <div className="w-full max-w-2xl flex flex-col items-center text-center space-y-8">
            <h1 className="text-[24px] md:text-[32px] font-bold text-gray-900 uppercase tracking-wide">
              EMAIL VERIFICATION
            </h1>

            <p className="text-gray-600 text-[14px] md:text-[15px] leading-relaxed whitespace-nowrap">
              We&apos;ve sent an e-mail with an activation code to your email. Check your spam
              folder if you didn&apos;t receive in primary folder
            </p>

            <div className="w-full max-w-[400px] pt-4">
              <input
                type="text"
                value={otp}
                onChange={handleOtpChange}
                placeholder="Input four digit"
                className="w-full px-6 py-4 bg-white border border-gray-200 rounded-[12px] text-[18px] text-center focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 tracking-widest placeholder:text-gray-300 transition-all"
              />
            </div>

            <div className="w-full max-w-[400px] pt-4">
              <button
                className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                onClick={() => {
                  if (otp.length === 4) {
                    router.push("/buy-now-pay-later?verified=true");
                  }
                }}
              >
                Verify
              </button>
            </div>

            <div className="pt-2">
              <p className="text-gray-600 text-[15px] font-medium">
                Resend Code in{" "}
                <span className="text-[#8cc629] font-bold">{formatTime(timeLeft)}</span>
              </p>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
