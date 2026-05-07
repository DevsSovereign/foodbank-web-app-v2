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

export default function BNPLOyoStaffDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    staffId: "",
    monthlySalary: "",
    officeAddress: "",
    bankName: "",
    accountNumber: "",
    accountName: "",
  });

  const BANKS = [
    "Access Bank",
    "First Bank",
    "GTBank",
    "UBA",
    "Zenith Bank",
    "Stanbic IBTC",
    "Sterling Bank",
  ];

  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      <BNPLSuccessModal
        isOpen={isSuccessModalOpen}
        onDone={() => router.push("/buy-now-pay-later/e-mandate")}
      />
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
        <NavBar breadcrumb="Oyo State Staff" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
          <div className="w-full max-w-5xl">
            <h1 className="text-[20px] font-bold text-gray-800 mb-8 uppercase tracking-wide">
              OYO STATE STAFF DETAILS
            </h1>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Staff Identification Number */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Staff Identification Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Staff Identification Number"
                    value={formData.staffId}
                    onChange={(e) => setFormData({ ...formData, staffId: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>

                {/* Monthly Salary */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Monthly Salary
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Monthly Salary"
                    value={formData.monthlySalary}
                    onChange={(e) => setFormData({ ...formData, monthlySalary: e.target.value })}
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

                {/* Salary Bank Name */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Salary Bank Name
                  </label>
                  <div className="relative">
                    <select
                      value={formData.bankName}
                      onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629] appearance-none"
                    >
                      <option value="" disabled>
                        Select salary bank name
                      </option>
                      {BANKS.map((bank) => (
                        <option key={bank} value={bank}>
                          {bank}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Salary Account Number */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Salary Account Number
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Salary Account Number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                  />
                </div>

                {/* Salary Bank Account Name */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Salary Bank Account Name
                  </label>
                  <input
                    type="text"
                    placeholder="Enter Salary Bank Account Name"
                    value={formData.accountName}
                    onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
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
                Confirm Details
              </button>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}
