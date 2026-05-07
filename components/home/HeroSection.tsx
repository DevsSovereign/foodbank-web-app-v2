"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SubscriptionAuthModal from "@/components/ui/SubscriptionAuthModal";
import EmailVerificationModal from "@/components/ui/EmailVerificationModal";
import HomePageMap from "./Map";

export default function HeroSection() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <HomePageMap />

        <div className="lg:col-span-2 flex flex-col gap-5">
          <div className="bg-[#36a64f] rounded-[18px] p-5 md:p-6 flex flex-col justify-center flex-1 relative shadow-sm overflow-hidden min-h-42.5">
            <div className="absolute top-0 right-0 h-full w-[65%] pointer-events-none z-0">
              <Image
                src="/assets/ellipse-6.png"
                alt="decorative green ellipse background"
                fill
                className="object-cover object-left"
              />
            </div>

            <div className="relative z-10 w-full flex flex-col h-full justify-between">
              <p className="text-white text-[15px] font-medium leading-[1.6] mb-5 max-w-[95%]">
                Enjoy the convenience of getting your groceries <br className="hidden lg:block" />
                and essentials instantly. Spread your payments <br className="hidden lg:block" />
                with flexible plans that fit your budget.
              </p>
              <button
                className="w-full bg-white text-[#2f9d58] py-3 rounded-lg text-[15px] font-bold shadow-sm hover:bg-gray-50 transition mt-auto tracking-wide cursor-pointer"
                onClick={() => setIsAuthModalOpen(true)}
              >
                Buy Now, Pay Later
              </button>
            </div>
          </div>

          <div className="bg-[#2a9d6c] rounded-[18px] p-5 md:p-6 relative overflow-hidden flex flex-col justify-center flex-1 min-h-42.5 shadow-sm">
            <div className="absolute top-1/2 -translate-y-1/2 -right-4 size-60 bg-[#f57422] rounded-full translate-x-[20%] z-0" />

            <div className="relative z-10 w-[60%] flex flex-col h-full justify-center">
              <h3 className="text-white font-bold text-[22px] mb-1 flex items-center gap-1.5 leading-none">
                Get Foodbank <span className="text-[#f57422]">Go</span>
              </h3>
              <p className="text-white/90 text-xs italic leading-snug mb-4 mt-2 pr-2">
                FoodbankGo is our restaurant ordering app. Download it to order meals from nearby
                restaurants.
              </p>
              <button className="flex items-center justify-center gap-2 bg-white text-[#f57422] px-4 py-2.5 rounded-lg text-[13px] font-bold shadow-sm hover:bg-gray-50 transition w-fit tracking-wide cursor-pointer">
                <Image
                  src="/assets/picon_playstore.svg"
                  alt="PlayStore"
                  width={14}
                  height={14}
                  className="object-contain"
                />
                Download App
              </button>
            </div>

            <div className="absolute -right-2 top-1/2 -translate-y-1/2 size-40 md:w-47.5 md:h-47.5 z-10 pointer-events-none">
              <Image
                src="/assets/get-foodbank.png"
                alt="Get Foodbank"
                fill
                className="object-contain drop-shadow-2xl translate-y-[-10%]"
              />
            </div>

            <div className="absolute bottom-6 right-6 bg-[#2a9d6c] rounded-full flex items-center gap-1.5 px-2 py-1.5 shadow-lg z-20 border-[3px] border-[#1f7a53]/30 -rotate-15 transform origin-bottom-right">
              <div className="size-4 rounded-full bg-white flex items-center justify-center text-[#f57422]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                </svg>
              </div>
              <span className="text-white text-[11px] font-bold min-w-3 text-center flex items-center justify-center">
                1
              </span>
              <div className="size-4 rounded-full bg-white flex items-center justify-center text-[#f57422]">
                <svg
                  width="10"
                  height="10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SubscriptionAuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />

      <EmailVerificationModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        onProceed={() => {
          setIsEmailModalOpen(false);
          router.push("/buy-now-pay-later");
        }}
      />
    </section>
  );
}
