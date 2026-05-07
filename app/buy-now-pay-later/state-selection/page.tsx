"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/toast/ToastProvider";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

const STATES = [
  { name: "Lagos State", icon: "/assets/lasg.png" },
  { name: "Oyo State", icon: "/assets/oyo.png" },
  { name: "Ogun State", icon: "/assets/lasg.png" }, // Matching screenshot icon even if it looks like Lagos
  { name: "Rivers State", icon: "/assets/rivers.png" },
  { name: "Abuja State", icon: "/assets/abuja.png" },
  { name: "Abeokuta State", icon: "/assets/abeokuta.png" },
  { name: "Delta State", icon: "/assets/delta.png" },
];

export default function BNPLStateSelectionPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [selectedState, setSelectedState] = useState("Lagos State");

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
        <NavBar breadcrumb="Personal Information" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
          <div className="w-full max-w-3xl">
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-12">
              <div className="space-y-1">
                {STATES.map((state) => (
                  <div
                    key={state.name}
                    onClick={() => setSelectedState(state.name)}
                    className="flex items-center justify-between p-4 cursor-pointer group border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 relative flex-shrink-0">
                        <Image src={state.icon} alt={state.name} fill className="object-contain" />
                      </div>
                      <span className="text-[16px] font-medium text-gray-700">{state.name}</span>
                    </div>

                    <div className="relative size-6 flex-shrink-0">
                      <div
                        className={`size-full border-2 rounded-full transition-all flex items-center justify-center ${
                          selectedState === state.name ? "border-[#8cc629]" : "border-gray-200"
                        }`}
                      >
                        {selectedState === state.name && (
                          <div className="size-3 bg-[#8cc629] rounded-full" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pb-10">
              <button
                className="w-full max-w-[450px] bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                onClick={() => {
                  if (selectedState === "Oyo State") {
                    router.push("/buy-now-pay-later/oyo-ministries");
                  } else if (selectedState === "Lagos State") {
                    router.push("/buy-now-pay-later/lagos-details");
                  } else {
                    toast({ variant: "info", title: `Submitted for ${selectedState}` });
                  }
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
