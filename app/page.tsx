"use client";

import { useState, useEffect } from "react";
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
import { useUserStore } from "@/store/useUserStore";

export default function HomePage() {
  const [isCategoriesLoading, setIsCategoriesLoading] = useState<boolean>(false);
  const [isOffersLoading, setIsOffersLoading] = useState<boolean>(false);
  const { userEligibles } = useUserStore();

  const spinEligible = !!userEligibles?.discountSpin?.eligible;
  const freeDeliveryEligible = !!userEligibles?.freeDelivery?.eligible;

  const [isSpinOpen, setIsSpinOpen] = useState<boolean>(false);
  const [isFreeDeliveryOpen, setIsFreeDeliveryOpen] = useState<boolean>(false);

  // Open the eligible modal(s). When both are eligible, show Spin & Win first;
  // Free Delivery is opened afterwards once Spin & Win is closed.
  useEffect(() => {
    if (spinEligible) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSpinOpen(true);
    } else if (freeDeliveryEligible) {
      setIsFreeDeliveryOpen(true);
    }
  }, [spinEligible, freeDeliveryEligible]);

  // Claiming the spin reward advances to Free Delivery (if eligible).
  const handleSpinClaim = () => {
    setIsSpinOpen(false);
    if (freeDeliveryEligible) {
      setIsFreeDeliveryOpen(true);
    }
  };

  // Dismissing the spin modal (✕) closes everything — no advance.
  const handleSpinDismiss = () => setIsSpinOpen(false);

  return (
    <>
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
      </div>

      {/* gamification modals — Spin & Win shows first, then Free Delivery */}
      <SpinAndWinModal open={isSpinOpen} onClose={handleSpinDismiss} onClaim={handleSpinClaim} />
      <FreeDeliveryModal open={isFreeDeliveryOpen} onClose={() => setIsFreeDeliveryOpen(false)} />
    </>
  );
}
