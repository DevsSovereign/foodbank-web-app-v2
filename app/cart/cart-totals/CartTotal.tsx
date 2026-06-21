"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";
import { handleError } from "@/lib/handle-error";
import { useToast } from "@/components/ui/toast/ToastProvider";
import LoaderSection from "@/components/ui/Loader";
import { CartTotalProps } from "@/types/user";
import { setToStorage } from "@/lib/auth-utils";
import { queryKeys } from "@/lib/queries";

export default function CartTotal({
  isLoading,
  subtotal,
  deliveryCharge,
  serviceCharge,
  total,
  accountType,
  canUsePromoCode,
  onProceedToCheckout,
}: CartTotalProps) {
  const { toast } = useToast();
  const [promoCode, setPromoCode] = useState<string>("");
  const [isInstructionAgreed, setIsInstructionAgreed] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: userService.validatePromoCode,
    onSuccess: async ({ message, data }) => {
      await queryClient.invalidateQueries({
        queryKey: [queryKeys.gamification, queryKeys.rewardHistory],
      });
      setToStorage("PROMO_CODE", JSON.stringify(data.rewardHistory.promoCodeDetails));
      toast({ variant: "success", title: message });
    },
    onError: (error) => {
      toast({ variant: "error", title: handleError(error) });
    },
  });

  return (
    <div className="w-full lg:w-95 space-y-6">
      <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800">Cart Totals</h3>
        </div>

        {isLoading ? (
          <LoaderSection />
        ) : (
          <div className="p-6 space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Sub total</span>
              <span className="font-bold text-gray-800">₦{subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Delivery Charge</span>
              <span className="font-bold text-gray-800">₦{deliveryCharge.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Service Charge</span>
              <span className="font-bold text-gray-800">₦{serviceCharge.toLocaleString()}.00</span>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between">
              <span className="font-bold text-gray-800">Total</span>
              <span className="text-xl font-bold text-gray-800">₦{total.toLocaleString()}.00</span>
            </div>

            {accountType === "flexible" ? (
              <div className="flex flex-col gap-4 w-full">
                <span className="font-medium text-sm text-gray-500">
                  Your account is a flexible account. Please proceed to checkout on our mobile
                  application
                </span>

                <div className="flex flex-wrap lg:flex-nowrap gap-3">
                  <a
                    href="https://apps.apple.com/ng/app/foodbankapp/id6608982689"
                    target="_blank"
                    className="flex items-center bg-[#2a2a2a] rounded-lg px-4 py-2.5 hover:bg-[#3a3a3a] transition cursor-pointer whitespace-nowrap"
                  >
                    <Image
                      src="/assets/apple-negative-1.svg"
                      alt="Apple logo"
                      width={20}
                      height={24}
                      className="w-5 h-6 object-contain"
                    />
                    <div className="ml-2.5">
                      <p className="text-[10px] text-gray-300 leading-tight">Download on the</p>
                      <p className="text-sm font-semibold text-white leading-tight">App Store</p>
                    </div>
                  </a>

                  <a
                    href="https://play.google.com/store/apps/details?id=com.foodbank4u.app"
                    target="_blank"
                    className="flex items-center bg-[#2a2a2a] rounded-lg px-4 py-2.5 hover:bg-[#3a3a3a] transition cursor-pointer whitespace-nowrap"
                  >
                    <Image
                      src="/assets/icon-google-play-1.svg"
                      alt="Google Play logo"
                      width={20}
                      height={24}
                      className="w-5 h-6 object-contain"
                    />
                    <div className="ml-2.5">
                      <p className="text-[10px] text-gray-300 leading-tight">Download on the</p>
                      <p className="text-sm font-semibold text-white leading-tight">Google play</p>
                    </div>
                  </a>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-4 w-full">
                <div className="flex items-start gap-2">
                  <input
                    checked={isInstructionAgreed}
                    onChange={(e) => setIsInstructionAgreed(e.target.checked)}
                    type="checkbox"
                    id="terms"
                    className="mt-1 accent-[#8cc629]"
                  />
                  <label htmlFor="terms" className="text-[12px] text-gray-500 leading-normal">
                    I have read the instruction above and I agree to{" "}
                    <Link href="/terms" className="text-gray-800 font-medium hover:underline">
                      FoodBank&apos;s Refund & Return Policy
                    </Link>
                  </label>
                </div>

                <button
                  onClick={onProceedToCheckout}
                  disabled={!isInstructionAgreed}
                  className="w-full bg-[#8cc629] disabled:opacity-60 text-white py-4 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#7db424] transition-colors mt-4 tracking-wide uppercase"
                >
                  Proceed to Checkout
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {canUsePromoCode && (
        <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-bold text-gray-800">Promo Code</h3>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!promoCode) return;
              mutate({ promoCode: promoCode, orderAmount: total });
            }}
            className="p-6"
          >
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              placeholder="Enter your promo code"
              className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm mb-4 focus:outline-none focus:border-[#8cc629]"
            />
            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-[#8cc629] text-white py-3 rounded-md font-bold text-sm hover:bg-[#7db424] transition-colors tracking-wide uppercase disabled:opacity-60"
            >
              {isPending ? "Please wait..." : "Apply Code"}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
