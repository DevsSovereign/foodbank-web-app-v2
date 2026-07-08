"use client";

import { useState } from "react";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import SubscriptionAuthModal from "@/components/ui/SubscriptionAuthModal";
import EmailVerificationModal from "@/components/ui/EmailVerificationModal";

export default function PromoBanners() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState<boolean>(false);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 min-h-[300px] lg:h-[340px]">
        {/* Buy Now, Pay Later */}
        <div className="bg-[#f4f5f7] relative overflow-hidden" data-aos="fade-right">
          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center">
            <div className="mb-4">
              <span className="inline-block bg-[#ff7300] text-white text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                ORDER NOW
              </span>
            </div>
            <h3 className="text-2xl md:text-[28px] font-bold text-gray-800 mb-3 leading-snug">
              Shop easily
            </h3>
            <p className="text-gray-500 text-xs md:text-sm mb-6 leading-relaxed">
              Enjoy the convenience of getting your groceries and essentials instantly.
              <br className="hidden lg:block" />
              Spread your payments with flexible plans that fit your budget.
            </p>
            <div className="mt-auto">
              <button
                className="flex items-center gap-2 bg-[#70c400] text-white px-6 py-3 text-xs md:text-sm font-bold hover:bg-[#5aad00] transition w-fit cursor-pointer"
                onClick={() => router.push("/search")}
              >
                SHOP NOW
                <ArrowRight className="size-4" />
              </button>
            </div>
          </div>

          {/* Phone image sticking out right side */}
          {/* <div className="absolute right-0 top-0 h-full w-[35%] lg:w-[40%] z-0">
            <Image
              src="/assets/bnpl.png"
              alt="Buy Now Pay Later App"
              fill
              quality={100}
              unoptimized={true}
              className="object-cover object-left"
            />
          </div> */}
        </div>

        {/* FoodBank V2 App */}
        <div className="bg-[#1c1d22] relative overflow-hidden" data-aos="fade-left">
          <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-center w-[55%]">
            <div className="mb-4">
              <span className="inline-block bg-[#70c400] text-[#1c1d22] text-[10px] md:text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                INTRODUCING NEW
              </span>
            </div>

            <h3 className="text-2xl md:text-[32px] font-medium text-white mb-0 leading-tight">
              FOODBANK
            </h3>
            <h3 className="text-2xl md:text-[32px] font-medium text-white mb-4 leading-tight">
              V2
            </h3>

            <p className="text-gray-400 text-xs md:text-sm mb-6 leading-relaxed font-light">
              Easy Use, Same experience, only on your Phone!!!
            </p>

            <div className="mt-auto">
              <div className="flex flex-wrap lg:flex-nowrap gap-3">
                <a
                  href="https://apps.apple.com/ng/app/foodbankapp/id6608982689"
                  target="_blank"
                  className="flex items-center gap-2 bg-[#2a2a2a] text-white px-2 py-1 text-xs font-bold hover:bg-[#3a3a3a] transition w-fit cursor-pointer rounded-md"
                >
                  <Image
                    src="/assets/apple-negative-1.svg"
                    alt="Apple logo"
                    width={16}
                    height={16}
                    className="object-contain"
                  />

                  <p className="font-semibold text-white">Get on App Store</p>
                </a>

                <a
                  href="https://play.google.com/store/apps/details?id=com.foodbank4u.app"
                  target="_blank"
                  className="flex items-center gap-2 bg-[#ff7300] text-white p-2 text-xs font-bold hover:bg-[#e66a00] transition w-fit cursor-pointer rounded-md"
                >
                  <Image
                    src="/assets/icon-google-play-1.svg"
                    alt="Google Play logo"
                    width={16}
                    height={16}
                    className="object-contain"
                  />

                  <span className="text-gray-300">Get on Play Store</span>
                </a>
              </div>
            </div>
          </div>

          {/* New App Images on right */}
          <div className="absolute right-0 top-0 h-full w-[50%] flex items-center justify-center z-0">
            {/* Floating NEW badge */}
            <div className="absolute top-10 right-1/4 lg:top-16 lg:right-[32%] size-[70px] lg:w-[85px] lg:h-[85px] bg-[#8ced00] rounded-full flex items-center justify-center z-0 shadow-[0_0_30px_rgba(140,237,0,0.5)]">
              <span className="text-white text-[14px] lg:text-[16px] font-bold">NEW</span>
            </div>

            <div className="w-[120%] h-[120px] absolute bg-[#86c039] rounded-full blur-3xl opacity-20 z-0"></div>

            <div className="size-[90%] relative z-10">
              <Image
                src="/assets/iphone-15-pro.png"
                alt="FoodBank V2 App"
                fill
                className="object-contain"
              />
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
