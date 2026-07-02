"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FundWalletDetails from "@/components/dashboard/FundWalletDetails";
import LoaderSection from "@/components/ui/Loader";
import { paymentService } from "@/lib/services/payment.service";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { handleError } from "@/lib/handle-error";
import type { BankTransferAccount } from "@/types/payment";

export default function TemporaryVirtualAccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const amount = Number(searchParams.get("amount"));
  const { user } = useUserStore();
  const { toast } = useToast();

  const [account, setAccount] = useState<BankTransferAccount | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate a one-time account for this payment. Runs once the amount and the
  // user's email are available; redirects back if the amount is missing.
  useEffect(() => {
    if (!amount || amount <= 0) {
      router.replace("/dashboard/fund-wallet");
      return;
    }

    if (!user?.email) return;

    let active = true;

    const generate = async () => {
      setIsLoading(true);
      try {
        const result = await paymentService.createBankTransferAccount({
          amount,
          email: user.email,
          mode: "backend",
        });
        if (!active) return;
        setAccount(result);
      } catch (err) {
        if (!active) return;
        toast({ variant: "error", title: handleError(err, "Failed to generate account.") });
        router.replace("/dashboard/fund-wallet");
      } finally {
        if (active) setIsLoading(false);
      }
    };

    generate();

    return () => {
      active = false;
    };
  }, [amount, user?.email, router, toast]);

  if (isLoading || !account) return <LoaderSection />;

  return (
    <FundWalletDetails
      accountName={account.accountName}
      accountNumber={account.accountNumber}
      bankName={account.bankName}
      amount={amount}
      reference={account.reference}
      expiresAt={account.expiresAt}
      showCountdown
    />
  );
}
