"use client";

import useGetCheckoutTotal from "@/hooks/useGetCheckoutTotal";

type CheckoutTotalType = "subtotal" | "deliveryCharge" | "serviceCharge" | "total";

export default function CheckoutTotal({ type = "total" }: { type: CheckoutTotalType }) {
  const { subtotal, deliveryFee, serviceFee, amountPay } = useGetCheckoutTotal();

  const displayedValue = () => {
    switch (type) {
      case "subtotal":
        return subtotal;

      case "deliveryCharge":
        return deliveryFee;

      case "serviceCharge":
        return serviceFee;

      default:
        return amountPay;
    }
  };

  return (
    <span
      className={`text-gray-800 ${type === "total" ? "font-black text-lg" : "font-bold text-base"}`}
    >
      ₦{displayedValue().toLocaleString("en-NG", { minimumFractionDigits: 2 })}
    </span>
  );
}
