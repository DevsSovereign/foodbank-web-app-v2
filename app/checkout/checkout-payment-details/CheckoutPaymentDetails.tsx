"use client";

import { Loader2 } from "lucide-react";
import CheckoutTotal from "@/components/ui/CheckoutTotal";
import useGetCheckoutTotal from "@/hooks/useGetCheckoutTotal";
import { formatCurrency } from "@/functions/formatCurrency";
import { useUserStore } from "@/store/useUserStore";
import {
  getSpinnedReward,
  getFreeDeliveryReward,
  getPromoReward,
  getSpinDiscount,
  getFreeDeliveryDiscount,
  getPromoDiscount,
} from "@/lib/gamification";
import type { RewardToggle, UserResponse } from "@/types/user";

interface CheckoutPaymentDetailsProps {
  accountType: UserResponse["accountType"] | undefined;
  walletBalance: number;
  paymentOption: "wallet" | "online";
  onPaymentOptionChange: (option: "wallet" | "online") => void;
  orderIsCreating: boolean;
  isConfirmDisabled: boolean;
  onConfirmCheckout: () => void;
}

export default function CheckoutPaymentDetails({
  accountType,
  walletBalance,
  paymentOption,
  onPaymentOptionChange,
  orderIsCreating,
  isConfirmDisabled,
  onConfirmCheckout,
}: CheckoutPaymentDetailsProps) {
  const { rewardsToUse, toggleRewardToUse } = useUserStore();
  const { appliedDiscounts, grossTotal, deliveryFee } = useGetCheckoutTotal();
  const spinnedReward = getSpinnedReward();
  const freeDeliveryReward = getFreeDeliveryReward();
  const promoCodeReward = getPromoReward();

  /** compute gamification array toggles from session storage, if it exists */
  const rewardToggles: RewardToggle[] = [
    spinnedReward && {
      type: "discountSpin" as const,
      label: "Apply Spin & Win reward",
      discountLabel: "Spin & Win Discount",
      discount: getSpinDiscount(spinnedReward, grossTotal),
      isApplied: rewardsToUse.discountSpin,
      onToggle: (value: boolean) => toggleRewardToUse("discountSpin", value),
    },
    freeDeliveryReward && {
      type: "freeDelivery" as const,
      label: "Apply Free Delivery reward",
      discountLabel: "Free Delivery Discount",
      discount: getFreeDeliveryDiscount(freeDeliveryReward, deliveryFee),
      isApplied: rewardsToUse.freeDelivery,
      onToggle: (value: boolean) => toggleRewardToUse("freeDelivery", value),
    },
    promoCodeReward && {
      type: "promoCode" as const,
      label: "Apply Promo Code reward",
      discountLabel: "Promo Code Discount",
      discount: getPromoDiscount(promoCodeReward, grossTotal),
      isApplied: rewardsToUse.promoCode,
      onToggle: (value: boolean) => toggleRewardToUse("promoCode", value),
    },
  ].filter((reward): reward is RewardToggle => Boolean(reward));

  /**  Dashboard-selected rewards have no toggle; show them as plain discount lines */
  const toggleTypes = new Set(rewardToggles.map((reward) => reward.type));

  /** Drop any type already represented by a session-storage toggle above */
  const dashboardDiscounts = appliedDiscounts.filter((discount) => !toggleTypes.has(discount.type));

  return (
    <>
      {/* Items Charges Card */}
      <div className="bg-white border border-[#f0f9e1] rounded-lg shadow-sm overflow-hidden p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
          <h2 className="text-[20px] font-bold text-gray-800">Items Charges</h2>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center text-gray-500 text-[14px]">
            <span>Subtotal</span>
            <CheckoutTotal type="subtotal" />
          </div>
          <div className="flex justify-between items-center text-gray-500 text-[14px]">
            <span>Delivery Charge</span>
            <CheckoutTotal type="deliveryCharge" />
          </div>
          <div className="flex justify-between items-center text-gray-500 text-[14px] mb-4">
            <span>Service Charge</span>
            <CheckoutTotal type="serviceCharge" />
          </div>

          <div className="border-t border-gray-500 w-full" />

          {/* Toggleable rewards won via session storage (spin, free delivery, promo) */}
          {rewardToggles.map((reward) => (
            <div key={reward.type} className="space-y-4">
              <div className="flex items-center justify-between gap-3 rounded-md bg-[#f9fdf4] border border-[#e2f0cc] px-3 py-2.5">
                <span className="text-sm font-medium text-gray-700">{reward.label}</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={reward.isApplied}
                  onClick={() => reward.onToggle(!reward.isApplied)}
                  className={`relative h-6 w-11 shrink-0 rounded-full p-1 transition-colors duration-300 ${reward.isApplied ? "bg-[#8cc629]" : "bg-gray-200"}`}
                >
                  <span
                    className={`block size-4 rounded-full bg-white shadow-sm transition-transform duration-300 ${reward.isApplied ? "translate-x-5" : "translate-x-0"}`}
                  />
                </button>
              </div>

              {reward.isApplied && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{reward.discountLabel}</span>
                  <span className="font-bold text-[#8cc629]">
                    −₦{reward.discount.toLocaleString()}.00
                  </span>
                </div>
              )}
            </div>
          ))}

          {/* Dashboard-selected rewards (no toggle) */}
          {dashboardDiscounts.map((discount) => (
            <div
              key={discount.type}
              className="flex justify-between items-center text-gray-500 text-[14px] mb-4"
            >
              <span>{discount.label}</span>
              <span className="text-[#8cc629] font-bold text-base">
                −₦{discount.amount.toLocaleString("en-NG", { minimumFractionDigits: 2 })}
              </span>
            </div>
          ))}

          <div className="flex justify-between items-center pt-5 border-t border-gray-500">
            <span className="font-bold text-gray-800 text-[15px]">Total</span>
            <CheckoutTotal type="total" />
          </div>
        </div>
      </div>

      {/* Payment Options Card */}
      <div className="bg-white border border-gray-100 rounded-lg shadow-sm pb-6">
        <div className="px-6 md:px-8 py-5 border-b border-gray-100 mb-6">
          <h2 className="text-[18px] font-bold text-gray-800">Payment Options</h2>
        </div>

        <div className="px-6 md:px-8">
          <div className="flex max-w-85 border border-gray-100 rounded-lg h-32.5">
            <div
              onClick={() => onPaymentOptionChange("wallet")}
              className={`flex-1 flex flex-col items-center justify-center border-r border-gray-100 cursor-pointer transition-colors ${paymentOption === "wallet" ? "bg-white" : "bg-gray-50"}`}
            >
              <span
                className={`text-2xl font-bold mb-1 ${paymentOption === "wallet" ? "text-[#8cc629]" : "text-gray-400"}`}
              >
                {formatCurrency(walletBalance)}
              </span>

              <span className="text-[12px] text-gray-800 mb-4 font-medium">Wallet Balance</span>
              <div
                className={`w-4.5 h-4.5 rounded-full flex items-center justify-center ${paymentOption === "wallet" ? "border-4 border-[#8cc629]" : "border border-gray-300"}`}
              >
                {paymentOption === "wallet" && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#8cc629]"></div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Confirm Checkout Button */}
      {accountType === "outright" && (
        <button
          type="button"
          disabled={isConfirmDisabled}
          onClick={onConfirmCheckout}
          className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white py-4.5 rounded-md font-bold text-[13px] tracking-wider transition-colors mt-6 uppercase flex justify-center items-center disabled:opacity-50"
        >
          {orderIsCreating ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Please wait...
            </>
          ) : (
            "Confirm Checkout"
          )}
        </button>
      )}
    </>
  );
}
