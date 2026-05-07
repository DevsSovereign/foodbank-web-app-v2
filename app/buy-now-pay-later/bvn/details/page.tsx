"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { User, Mail, Phone, MapPin, Calendar, UserCircle } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function BNPLBVNDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "Hassan Olufemi Peter",
    phoneNumber: "+2348160749622",
    email: "peterhassan@gmail.com",
    gender: "Male",
    image: "Male",
    dob: "1984-05-06",
    address: "12 Ogudu Road, Ojota, Lagos",
  });

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
        <NavBar breadcrumb="Buy Now, Pay Later" />

        <main className="flex-1 flex flex-col items-center justify-start px-4 py-8 md:py-12">
          <div className="w-full max-w-5xl">
            <div className="flex items-center gap-3 mb-8">
              <div className="size-10 bg-[#f8faf6] rounded-lg flex items-center justify-center">
                <UserCircle className="size-6 text-[#8cc629]" />
              </div>
              <h1 className="text-[20px] font-bold text-gray-800 uppercase tracking-wide">
                PERSONAL INFORMATION
              </h1>
            </div>

            <div className="bg-white border border-gray-100 rounded-[24px] p-6 md:p-10 shadow-sm mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.fullName}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Phone Number
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
                      <div className="w-5 h-3 bg-green-600 rounded-sm overflow-hidden flex flex-col">
                        <div className="h-full bg-green-600" />
                        <div className="h-full bg-white" />
                        <div className="h-full bg-green-600" />
                      </div>
                    </div>
                    <input
                      type="text"
                      value={formData.phoneNumber}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* E-mail */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">E-mail</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">Gender</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.gender}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Image (Mocked as text field per design) */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">Image</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.image}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Date of Birth */}
                <div className="space-y-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.dob}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Residential Address */}
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-[14px] font-medium text-gray-700">
                    Residential Address
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                    <input
                      type="text"
                      value={formData.address}
                      readOnly
                      className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-[12px] text-[15px] text-gray-600 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-12 pb-10">
              <button
                className="w-full max-w-[450px] bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-[12px] text-[18px] transition-all active:scale-[0.98] shadow-md uppercase tracking-wide"
                onClick={() => router.push("/buy-now-pay-later/state-selection")}
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
