"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check, Loader2 } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";
import { useUserStore } from "@/store/useUserStore";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { paymentService } from "@/lib/services/payment.service";
import { handleError } from "@/lib/handle-error";

const FLAT_FEE = 50;

const formatNaira = (value: number) => `₦${value.toLocaleString("en-NG")}`;

interface FundWalletDetailsProps {
  accountName: string;
  accountNumber: string;
  bankName: string;
  amount: number;
  showCountdown?: boolean;
  expiresAt?: string;
  reference?: string;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

/** Seconds remaining until `expiresAt`, clamped at 0. */
const remainingSeconds = (expiresAt?: string) => {
  if (!expiresAt) return 0;
  const diffMs = new Date(expiresAt).getTime() - Date.now();
  return Number.isNaN(diffMs) ? 0 : Math.max(0, Math.floor(diffMs / 1000));
};

export default function FundWalletDetails({
  accountName,
  accountNumber,
  bankName,
  amount,
  showCountdown = false,
  expiresAt,
  reference,
}: FundWalletDetailsProps) {
  const router = useRouter();
  const { copy, copied } = useCopyToClipboard();
  const { user } = useUserStore();
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(() => remainingSeconds(expiresAt));
  const [isVerifying, setIsVerifying] = useState(false);

  const total = amount + FLAT_FEE;
  const amountEntered = formatNaira(amount);
  const fee = formatNaira(FLAT_FEE);
  const amountToReceive = formatNaira(total);

  useEffect(() => {
    if (!showCountdown) return;
    const interval = setInterval(() => {
      setTimeLeft(remainingSeconds(expiresAt));
    }, 1000);
    return () => clearInterval(interval);
  }, [showCountdown, expiresAt]);

  const handleConfirmTransfer = async () => {
    // No reference (e.g. permanent account) — nothing to verify, just leave.
    if (!reference) {
      router.replace("/dashboard");
      return;
    }

    if (!user?._id) {
      toast({ variant: "error", title: "You must be logged in to confirm a transfer." });
      return;
    }

    setIsVerifying(true);
    try {
      await paymentService.verifyBankTransfer({ userId: user._id, reference });
      toast({ variant: "success", title: "Payment confirmed. Your wallet will update shortly." });
      router.replace("/dashboard");
    } catch (err) {
      toast({ variant: "error", title: handleError(err, "Could not verify payment yet.") });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="w-full max-w-3xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
          {showCountdown ? "This account Number will expire in" : "Choose Payment Account"}
        </h1>
        {showCountdown && (
          <div className="text-[#8cc629] text-2xl md:text-3xl font-bold font-mono tracking-wider sm:tracking-widest mb-3">
            {formatTime(timeLeft)}
          </div>
        )}
        <p className="text-[13px] text-gray-600">
          Transfer only once within the given time frame, and also send the exact amount of{" "}
          {amountToReceive} to this account number
        </p>
      </div>

      {/* Details Card */}
      <div className="w-full max-w-162.5 bg-white border border-gray-100 shadow-sm p-5 sm:p-8 rounded-sm mb-6">
        <div className="space-y-6">
          {/* Account Name */}
          <div className="flex justify-between items-center gap-3 pb-6 border-b border-gray-100">
            <span className="text-[13px] text-gray-500 font-medium shrink-0">Account Name</span>
            <span className="text-[14px] font-black text-gray-800 text-right wrap-break-word">
              {accountName}
            </span>
          </div>

          {/* Account Number */}
          <div>
            <span className="block text-[13px] text-gray-500 font-medium mb-1">Account Number</span>
            <div className="flex justify-between items-center gap-3">
              <span className="text-[15px] font-bold text-gray-800 break-all">{accountNumber}</span>
              <button
                onClick={() => copy(accountNumber)}
                className="flex shrink-0 items-center gap-1.5 text-[#8cc629] text-xs font-bold uppercase transition hover:opacity-80"
              >
                {copied ? (
                  <span className="flex items-center gap-1.5 text-[#6dbb00]">
                    Copied <Check className="size-4" />
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    Copy <Copy className="size-4" />
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Bank Name */}
          <div className="pb-6 border-b border-gray-100">
            <span className="block text-[13px] text-gray-500 font-medium mb-1">Bank Name</span>
            <span className="text-[15px] font-bold text-gray-800">{bankName}</span>
          </div>

          {/* Amount Structure */}
          <div className="space-y-4">
            <div>
              <span className="block text-[13px] text-gray-500 font-medium mb-1">Amount Entered</span>
              <span className="text-[15px] font-bold text-gray-800">{amountEntered}</span>
            </div>
            <div>
              <span className="block text-[13px] text-gray-500 font-medium mb-1">Fee</span>
              <span className="text-[15px] font-bold text-gray-800">{fee}</span>
            </div>
            <div>
              <span className="block text-[13px] text-gray-500 font-medium mb-1">
                Amount to receive
              </span>
              <span className="text-[15px] font-bold text-[#8cc629]">{amountToReceive}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="w-full max-w-162.5">
        <button
          onClick={handleConfirmTransfer}
          disabled={isVerifying}
          className="w-full flex justify-center items-center gap-2 bg-[#8cc629] hover:bg-[#7db424] text-white py-4 font-bold text-[12px] uppercase tracking-wider transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isVerifying && <Loader2 className="size-4 animate-spin" />}
          {isVerifying ? "VERIFYING..." : "I HAVE TRANSFERRED THE MONEY"}
        </button>
      </div>
    </div>
  );
}
