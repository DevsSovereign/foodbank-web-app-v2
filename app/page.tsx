"use client";

import React, { useState, useEffect } from "react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import HeroSection from "@/components/home/HeroSection";
import TrustBadges from "@/components/home/TrustBadges";
import CategoriesSection from "@/components/home/CategoriesSection";
import SpecialOffers from "@/components/home/SpecialOffers";
import PromoBanners from "@/components/home/PromoBanners";
import Footer from "@/components/layout/Footer";
import Image from "next/image";
import SpinAndWinModal from "@/components/ui/SpinAndWinModal";
import FreeDeliveryModal from "@/components/ui/FreeDeliveryModal";
import LoadingBlurOverlay from "@/components/ui/LoadingBlurOverlay";

export default function HomePage() {
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);
  const [isFreeDeliveryOpen, setIsFreeDeliveryOpen] = useState(false);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(false);
  const [isOffersLoading, setIsOffersLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFreeDeliveryOpen(true);
    }, 7000); // 7 seconds delay for Free Delivery popup

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#fafeff] font-sans relative overflow-x-hidden">
      <TopRibbon />
      <Header />
      <NavBar />

      <main className="flex-1 relative">
        <LoadingBlurOverlay isActive={isCategoriesLoading || isOffersLoading} />
        <div className="absolute top-75 left-0 pointer-events-none z-0 hidden lg:block w-10 h-50">
          <Image
            src="/assets/left.png"
            alt="side-banner"
            fill
            className="object-contain object-left"
          />
        </div>
        <div className="absolute top-125 right-0 pointer-events-none z-0 hidden lg:block w-10 h-50">
          <Image
            src="/assets/right.png"
            alt="decorative right-side background accent"
            fill
            className="object-contain object-right"
          />
        </div>

        <HeroSection />
        <TrustBadges />
        <CategoriesSection onLoadingChange={setIsCategoriesLoading} />
        <SpecialOffers onLoadingChange={setIsOffersLoading} />
        <PromoBanners />
      </main>

      <Footer />

      {/* <SpinAndWinModal isOpen={isSpinModalOpen} onClose={() => setIsSpinModalOpen(false)} />

      <FreeDeliveryModal
        isOpen={isFreeDeliveryOpen}
        onClose={() => {
          setIsFreeDeliveryOpen(false);
          // Slight delay to allow Free Delivery to fade out before Spin & Win fades in
          setTimeout(() => {
            setIsSpinModalOpen(true);
          }, 500);
        }}
      /> */}
    </div>
  );
}
