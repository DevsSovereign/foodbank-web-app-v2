import React from "react";
import Image from "next/image";
import Link from "next/link";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col relative overflow-hidden font-sans">
      <TopRibbon />
      <Header />
      <NavBar breadcrumb="Home >>" />

      <main className="flex-1 flex flex-col items-center justify-start px-4 pt-8 pb-12 md:pt-12 md:pb-20">
        <div className="w-full max-w-xl text-center flex flex-col items-center mt-4 md:mt-8">
          {/* 404 Alien Image */}
          <div className="relative w-full max-w-[300px] h-[180px] md:h-[240px] mb-6 md:mb-8">
            <Image
              src="/error-alien-spaceship.png"
              alt="404 Page Not Found"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-[24px] md:text-[36px] font-bold text-gray-900 mb-2 md:mb-3">
            Page Not Found
          </h1>

          <p className="text-gray-500 text-[13px] md:text-[15px] max-w-[420px] mx-auto leading-relaxed mb-8 md:mb-10">
            The page you are looking for might have been removed had its name changed or is
            temporarily unavailable.
          </p>

          <Link
            href="/"
            className="inline-block bg-[#8cc629] hover:bg-[#7db424] text-white font-bold px-8 py-3 rounded-[32px] text-[14px] md:text-[16px] transition-all shadow-md uppercase tracking-wide active:scale-95"
          >
            Home Page
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
