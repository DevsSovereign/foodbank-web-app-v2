"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FundWalletDetails from "@/components/dashboard/FundWalletDetails";

export default function TemporaryVirtualAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get("amount"));

  // This screen is only reachable after entering an amount on the fund-wallet
  // page. Send the user back if it's missing or invalid.
  useEffect(() => {
    if (!amount || amount <= 0) router.replace("/dashboard/fund-wallet");
  }, [amount, router]);

  if (!amount || amount <= 0) return null;

  // Temporary (one-time) virtual account. No generation API exists yet, so the
  // account details mirror the design. Swap these for the generated account
  // once the endpoint is available.
  return (
    <FundWalletDetails
      accountName="FOODBANK"
      accountNumber="9843268434"
      bankName="Paystack-Titan"
      amount={amount}
      showCountdown
    />
  );
}
