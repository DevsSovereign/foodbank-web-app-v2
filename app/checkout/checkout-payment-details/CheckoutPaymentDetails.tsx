"use client";

import { Loader2 } from "lucide-react";
import CheckoutTotal from "@/components/ui/CheckoutTotal";
import useGetCheckoutTotal from "@/hooks/useGetCheckoutTotal";
import { formatCurrency } from "@/functions/formatCurrency";
import type { UserResponse } from "@/types/user";

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
  const { appliedDiscounts } = useGetCheckoutTotal();

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

          {/* One line per applied reward (cart toggles + dashboard selections) */}
          {appliedDiscounts.map((discount) => (
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

          <div className="flex justify-between items-center pt-5 border-t border-gray-100">
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
