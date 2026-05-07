"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useToast } from "@/components/ui/toast/ToastProvider";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

const MINISTRIES = [
  "OVRTMA, Oyo State Road Traffic Management Authority.",
  "MITC&I, Ministry of Investment Trade Cooperative & Industry",
  "OYFSA, Oyo State Fire Service Agency",
  "SUREB, State Universal Basic Education Board",
  "Office of the State Auditor General",
  "Ministry of Education, Science and Technology",
  "Ministry of Health",
  "Ministry of Agriculture and Rural Development",
  "Ministry of Works and Transport",
  "Ministry of Lands, Housing and Urban Development",
  "Ministry of Local Government and Chieftaincy Matters",
];

export default function BNPLOyoMinistriesPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState("");

  const filteredMinistries = MINISTRIES.filter((m) =>
    m.toLowerCase().includes(searchQuery.toLowerCase()),
  );

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
        <NavBar breadcrumb="Oyo State Government" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
          <div className="w-full max-w-3xl">
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-12">
              <h2 className="text-[18px] font-bold text-gray-900 mb-6 uppercase tracking-wide">
                OYO STATE GOVERNMENT MINSITRIES
              </h2>

              <div className="relative mb-8">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search to select for ministry"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-white border border-[#8cc629]/30 rounded-[8px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 placeholder:text-gray-400 transition-all"
                />
              </div>

              <div className="max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="space-y-1">
                  {filteredMinistries.map((ministry) => (
                    <div
                      key={ministry}
                      onClick={() => setSelectedMinistry(ministry)}
                      className="flex items-center gap-4 p-4 cursor-pointer hover:bg-gray-50/50 rounded-lg group transition-colors border-b border-gray-50 last:border-0"
                    >
                      <div
                        className={`size-6 rounded-full border-2 transition-all flex items-center justify-center flex-shrink-0 ${
                          selectedMinistry === ministry ? "border-[#8cc629]" : "border-gray-200"
                        }`}
                      >
                        {selectedMinistry === ministry && (
                          <div className="size-3 bg-[#8cc629] rounded-full" />
                        )}
                      </div>
                      <span className="text-[14px] md:text-[15px] text-gray-700 leading-tight">
                        {ministry}
                      </span>
                    </div>
                  ))}
                  {filteredMinistries.length === 0 && (
                    <div className="p-8 text-center text-gray-400 text-[14px]">
                      No ministries found matching your search.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-start pb-10">
              <button
                className="w-full max-w-[450px] bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                onClick={() => {
                  if (selectedMinistry) {
                    router.push("/buy-now-pay-later/oyo-staff-details");
                  } else {
                    toast({ variant: "error", title: "Please select a ministry." });
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

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #8cc629;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #7db424;
        }
      `}</style>
    </div>
  );
}
