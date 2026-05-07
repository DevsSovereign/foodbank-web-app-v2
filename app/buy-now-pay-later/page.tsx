"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import { User, Mail, Phone, MapPin, Copy, ChevronRight, CheckCircle2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";

function BNPLPersonalInformationPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const [formData, setFormData] = useState({
    firstName: "Ruth",
    lastName: "Ruth",
    email: "Gbags, Shoms",
    phoneNumber: "+234",
    deliveryAddress: "Gbags, Shoms",
    referralCode: "peter454",
  });

  return (
    <SidebarProvider>
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

          <div className="flex-1 flex flex-col md:flex-row max-w-[1440px] w-full mx-auto relative mt-8">
            <Sidebar />

            <main className="flex-1 p-6 md:px-10 md:pb-10 md:pt-2 lg:px-10 relative z-10">
              <div className="w-full max-w-5xl">
                <h1 className="text-[20px] font-bold text-gray-900 mb-8 uppercase tracking-wide">
                  PERSONAL INFORMATION
                </h1>

                <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                    {/* First Name */}
                    <div className="space-y-2">
                      <label className="block text-[14px] font-medium text-gray-700">
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="block text-[14px] font-medium text-gray-700">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                          <div className="w-6 h-4 bg-green-600 rounded-sm overflow-hidden flex flex-col">
                            <div className="h-full bg-green-600" />
                            <div className="h-full bg-white" />
                            <div className="h-full bg-green-600" />
                          </div>
                        </div>
                        <input
                          type="text"
                          value={formData.phoneNumber}
                          onChange={(e) =>
                            setFormData({ ...formData, phoneNumber: e.target.value })
                          }
                          className="w-full pl-14 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Last Name */}
                    <div className="space-y-2">
                      <label className="block text-[14px] font-medium text-gray-700">
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600"
                        />
                      </div>
                    </div>

                    {/* Delivery Address */}
                    <div className="space-y-2">
                      <label className="block text-[14px] font-medium text-gray-700">
                        Delivery Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="text"
                          value={formData.deliveryAddress}
                          onChange={(e) =>
                            setFormData({ ...formData, deliveryAddress: e.target.value })
                          }
                          className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600"
                        />
                      </div>
                    </div>

                    {/* E-mail */}
                    <div className="space-y-2">
                      <label className="block text-[14px] font-medium text-gray-700">
                        E-mail <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                        <input
                          type="email"
                          value={formData.email}
                          readOnly={isVerified}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full pl-12 pr-12 py-3 border rounded-[12px] text-[15px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 transition-colors ${
                            isVerified ? "bg-[#F3F4F6] border-gray-100" : "bg-white border-gray-200"
                          }`}
                        />
                        {isVerified && (
                          <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 size-5 text-[#8cc629]" />
                        )}
                      </div>
                      {!isVerified && (
                        <p
                          className="text-red-500 text-[13px] font-medium mt-1 cursor-pointer hover:underline text-right"
                          onClick={() => router.push("/buy-now-pay-later/verify")}
                        >
                          Verify your Email
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100 w-full mb-8 shadow-sm" />

                <div className="bg-white border border-gray-100 rounded-[24px] p-8 shadow-sm mb-12">
                  <div className="flex flex-col space-y-4">
                    <p className="text-[15px] font-medium text-gray-800">
                      Number of Referral: <span className="font-bold">0</span>
                    </p>

                    <div className="space-y-2 max-w-[400px]">
                      <label className="block text-[14px] font-medium text-gray-600">
                        Referral Code
                      </label>
                      <div className="relative group">
                        <input
                          type="text"
                          value={formData.referralCode}
                          readOnly
                          className="w-full px-4 py-3.5 bg-[#F3F4F6] border border-gray-200 rounded-[12px] text-[15px] text-gray-600 pr-12 focus:outline-none"
                        />
                        <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8cc629] hover:text-[#7db424] transition-colors p-1 group-hover:scale-110">
                          <Copy className="size-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-12 pb-10">
                  <button
                    className="w-full max-w-[400px] bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                    onClick={() => router.push("/buy-now-pay-later/plan-change")}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function BNPLPersonalInformationPage() {
  return (
    <Suspense fallback={null}>
      <BNPLPersonalInformationPageInner />
    </Suspense>
  );
}
