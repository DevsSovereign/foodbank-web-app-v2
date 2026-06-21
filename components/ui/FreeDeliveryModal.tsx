"use client";

import Image from "next/image";
import { XCircle } from "lucide-react";
import { STORAGE_KEYS } from "@/lib/auth-utils";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";
import { useToast } from "./toast/ToastProvider";
import { handleError } from "@/lib/handle-error";
import { ClaimGamificationPayload } from "@/types/user";

interface FreeDeliveryModalProps {
  open: boolean;
  /** Dismiss without claiming (e.g. the ✕ button). */
  onClose: () => void;
}

export default function FreeDeliveryModal({ open, onClose }: FreeDeliveryModalProps) {
  const { toast } = useToast();

  // claim mutation
  const {
    isPending: isClaiming,
    isSuccess: isClaimed,
    mutate: claimMutation,
  } = useMutation({
    mutationFn: userService.claimGamification,
    onSuccess: (data) => {
      sessionStorage.setItem(STORAGE_KEYS.FREE_DELIVERY, JSON.stringify(data));
      onClose();
    },
    onError: (error) => {
      const message = handleError(error);
      toast({ variant: "error", title: message });
    },
  });

  const handleClaimFreeDelivery = () => {
    const payload: ClaimGamificationPayload = {
      reward: "Free Delivery" as const,
      rewardType: "freeDelivery",
    };

    claimMutation(payload);
  };

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 z-[120] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4 overflow-y-auto overflow-x-hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
    >
      <div className="relative p-6 md:p-8 max-w-[440px] w-full flex flex-col items-center text-center animate-in fade-in zoom-in-95 duration-500 my-4">
        {/* Close Button placed above heading */}
        <div className="flex justify-center mb-4 w-full relative">
          <button
            onClick={onClose}
            className="absolute right-0 top-0 md:-right-8 md:-top-8 text-white hover:text-gray-300 transition-colors bg-black/20 rounded-full p-2"
          >
            <XCircle className="size-7" strokeWidth={1.5} />
          </button>
        </div>

        <div className="mb-2">
          <span className="text-[40px]">🎉</span>
        </div>
        <h2 className="text-[28px] md:text-[34px] font-extrabold text-white mb-1 leading-tight tracking-tight drop-shadow-md">
          Congratulations!
        </h2>
        <p className="text-[20px] md:text-[24px] font-bold text-white mb-6 tracking-wide drop-shadow-md">
          You&apos;ve won Free Delivery
        </p>

        {/* Free Delivery Image */}
        <div
          className={`relative size-64 md:w-[280px] md:h-[280px] mb-6 flex items-center justify-center pointer-events-none drop-shadow-2xl mx-auto transition-all transform ${isClaimed ? "duration-[1500ms] translate-x-[150vw] ease-in-out" : "duration-[1200ms] translate-x-0"}`}
        >
          <Image
            src="/freedelivery.png"
            alt="Free Delivery Prize"
            fill
            className="object-contain"
            priority
          />
        </div>

        {/* Action Button & Footer Info */}
        <div
          className={`w-full max-w-[320px] mx-auto relative z-10 mt-4 md:mt-8 transition-opacity duration-300 ${isClaimed ? "opacity-0" : "opacity-100"}`}
        >
          <button
            onClick={handleClaimFreeDelivery}
            disabled={isClaimed || isClaiming}
            className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 rounded-xl text-[18px] md:text-[20px] transition-all shadow-xl shadow-[#8cc629]/20 tracking-wide mb-4 active:scale-95 disabled:opacity-50"
          >
            {isClaiming ? "Claiming" : "Claim Reward"}
          </button>
          <p className="text-[12px] md:text-[13px] text-white/90 font-medium leading-relaxed italic drop-shadow-sm">
            Thank you for shopping with us! Spin again on your next purchase above ₦30,000
          </p>
        </div>
      </div>
    </div>
  );
}
