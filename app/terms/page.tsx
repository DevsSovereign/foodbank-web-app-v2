"use client";

import React from "react";
import Image from "next/image";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";
import Sidebar from "@/components/layout/Sidebar";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import TermsContent from "@/components/legal/TermsContent";

export default function TermsPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col relative overflow-hidden">
        <Image
          src="/assets/left.png"
          alt="decorative left-side background accent"
          width={180}
          height={200}
          className="absolute left-0 top-[35%] -translate-y-1/2 z-0 hidden md:block pointer-events-none h-50 w-auto object-contain"
        />

        <div className="relative z-10 flex flex-col min-h-screen">
          <TopRibbon />
          <Header />
          <NavBar breadcrumb="Terms and Conditions" />

          <div className="flex-1 flex flex-col md:flex-row max-w-360 w-full mx-auto relative mt-8">
            <Sidebar />

            <main className="flex-1 p-6 md:px-10 md:pb-10 md:pt-2 lg:px-10 relative z-10">
              <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden py-10">
                <TermsContent hideButton={true} />
              </div>
            </main>
          </div>

          <Footer />
        </div>
      </div>
    </SidebarProvider>
  );
}
