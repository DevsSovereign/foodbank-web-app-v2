"use client";

import { useSearchParams } from "next/navigation";

type CheckoutTotalType = "subtotal" | "deliveryCharge" | "serviceCharge" | "total";

export default function CheckoutTotal({ type = "total" }: { type: CheckoutTotalType }) {
  const searchParams = useSearchParams();

  const subtotal = Number(searchParams.get("sub") ?? 0);
  const deliveryCharge = Number(searchParams.get("del") ?? 0);
  const serviceCharge = Number(searchParams.get("svc") ?? 500);

  const total = subtotal + deliveryCharge + serviceCharge;

  const displayedValue = () => {
    switch (type) {
      case "subtotal":
        return subtotal;

      case "deliveryCharge":
        return deliveryCharge;

      case "serviceCharge":
        return serviceCharge;

      default:
        return total;
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
