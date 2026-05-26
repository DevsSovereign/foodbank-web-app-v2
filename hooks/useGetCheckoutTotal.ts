"use client";

import { useSearchParams } from "next/navigation";

const useGetCheckoutTotal = () => {
  const searchParams = useSearchParams();

  const subtotal = Number(searchParams.get("sub") ?? 0);
  const deliveryFee = Number(searchParams.get("del") ?? 0);
  const serviceFee = Number(searchParams.get("svc") ?? 500);

  const amountPay = subtotal + deliveryFee + serviceFee;

  return { subtotal, deliveryFee, serviceFee, amountPay };
};

export default useGetCheckoutTotal;
