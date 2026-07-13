"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
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
  const hasGeneratedRef = useRef(false);
  const [account, setAccount] = useState<BankTransferAccount | null>(null);

  const { mutate: generateAccount } = useMutation({
    mutationFn: paymentService.createBankTransferAccount,
    onSuccess: (data) => {
      setAccount(data);
    },
    onError: (err) => {
      toast({ variant: "error", title: handleError(err, "Failed to generate account.") });
      router.replace("/dashboard/fund-wallet");
    },
  });

  useEffect(() => {
    if (!amount || amount <= 0) {
      router.replace("/dashboard/fund-wallet");
      return;
    }

    if (!user?.email) return;

    if (hasGeneratedRef.current) return;
    hasGeneratedRef.current = true;

    generateAccount({
      amount,
      email: user.email,
      mode: "paystack",
      metadata: {
        source: "foodbank_add_fund",
        paymentPurpose: "general_wallet_topup",
        amount,
      },
    });
  }, [amount, user?.email, router, generateAccount]);

  if (!account) return <LoaderSection />;

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
