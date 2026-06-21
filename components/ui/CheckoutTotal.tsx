"use client";

import useGetCheckoutTotal from "@/hooks/useGetCheckoutTotal";

type CheckoutTotalType = "subtotal" | "deliveryCharge" | "serviceCharge" | "discount" | "total";

export default function CheckoutTotal({ type = "total" }: { type: CheckoutTotalType }) {
  const { subtotal, deliveryFee, serviceFee, totalDiscount, amountPay } = useGetCheckoutTotal();

  const isDiscount = type === "discount";

  const displayedValue = () => {
    switch (type) {
      case "subtotal":
        return subtotal;

      case "deliveryCharge":
        return deliveryFee;

      case "serviceCharge":
        return serviceFee;

      case "discount":
        return totalDiscount;

      default:
        return amountPay;
    }
  };

  return (
    <span
      className={`${isDiscount ? "text-[#8cc629]" : "text-gray-800"} ${type === "total" ? "font-black text-lg" : "font-bold text-base"}`}
    >
      {isDiscount ? "−" : ""}₦
      {displayedValue().toLocaleString("en-NG", { minimumFractionDigits: 2 })}
    </span>
  );
}
