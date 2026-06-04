"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import FundWalletDetails from "@/components/dashboard/FundWalletDetails";
import { useUserStore } from "@/store/useUserStore";
import LoaderSection from "@/components/ui/Loader";

export default function PermanentVirtualAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get("amount"));
  const { user } = useUserStore();

  // The permanent account flow is only reachable after entering an amount and
  // completing BVN verification on the fund-wallet page. Send the user back if
  // the amount is missing or they have no virtual account.
  useEffect(() => {
    if (!amount || amount <= 0) {
      router.replace("/dashboard/fund-wallet");
      return;
    }
    if (user && !user.virtualAccount?.virtualAccountNumber) {
      router.replace("/dashboard/fund-wallet");
    }
  }, [amount, user, router]);

  if (!amount || amount <= 0 || !user?.virtualAccount?.virtualAccountNumber) {
    return <LoaderSection />;
  }

  const { accountName, virtualAccountNumber, bankName } = user.virtualAccount;

  return (
    <FundWalletDetails
      accountName={accountName}
      accountNumber={virtualAccountNumber}
      bankName={bankName}
      amount={amount}
    />
  );
}
