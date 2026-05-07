"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";
import BNPLSuccessModal from "@/components/ui/BNPLSuccessModal";

export default function BNPLasgDetailsPage() {
  const router = useRouter();
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    ministry: "",
    officeAddress: "",
    street: "",
    phoneNumber: "",
    staffId: "",
  });

  const STREETS = [
    "Ikorodu Road",
    "Herbert Macaulay Way",
    "Adetokunbo Ademola Street",
    "Ahamadu Bello Way",
    "Ozumba Mbadiwe Avenue",
  ];

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
        <NavBar breadcrumb="Lagos State Staff" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
          <div className="w-full max-w-5xl">
            <h1 className="text-[20px] font-bold text-gray-800 mb-8 uppercase tracking-wide">
              LAGOS - DETAILS
            </h1>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>

                {/* Ministry */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">Ministry</label>
                  <input
                    type="text"
                    placeholder="Enter Staff Identification Number"
                    value={formData.ministry}
                    onChange={(e) => setFormData({ ...formData, ministry: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>

                {/* Office Address */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Office Address
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Office Address"
                    value={formData.officeAddress}
                    onChange={(e) => setFormData({ ...formData, officeAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>

                {/* Street */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">Street</label>
                  <div className="relative">
                    <select
                      value={formData.street}
                      onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629] appearance-none"
                    >
                      <option value="" disabled>
                        Street
                      </option>
                      {STREETS.map((street) => (
                        <option key={street} value={street}>
                          {street}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="Your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>

                {/* Staff ID Number */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Staff ID Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter staff ID number"
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12 pb-10">
              <button
                className="w-full max-w-[450px] bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                onClick={() => setIsSuccessModalOpen(true)}
              >
                Submit
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      <BNPLSuccessModal
        isOpen={isSuccessModalOpen}
        onDone={() => router.push("/buy-now-pay-later/e-mandate")}
      />
    </div>
  );
}
