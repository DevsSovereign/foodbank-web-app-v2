"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Copy, Check } from "lucide-react";
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard";

/** Flat transaction fee (Naira) added on top of the amount the user sends. */
const FLAT_FEE = 50;

const formatNaira = (value: number) => `N${value.toLocaleString("en-NG")}`;

interface FundWalletDetailsProps {
  accountName: string;
  accountNumber: string;
  bankName: string;
  /** Amount the user chose to send (from the Amount modal). */
  amount: number;
  /** Show the expiry countdown (Temporary Virtual Account). Omit for Permanent. */
  showCountdown?: boolean;
  /** Initial countdown duration in seconds. Defaults to 23:56:17 (matches design). */
  initialSeconds?: number;
}

const formatTime = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
};

export default function FundWalletDetails({
  accountName,
  accountNumber,
  bankName,
  amount,
  showCountdown = false,
  initialSeconds = 23 * 3600 + 56 * 60 + 17,
}: FundWalletDetailsProps) {
  const router = useRouter();
  const { copy, copied } = useCopyToClipboard();
  const [timeLeft, setTimeLeft] = useState(initialSeconds);

  const total = amount + FLAT_FEE;
  const amountEntered = formatNaira(amount);
  const fee = formatNaira(FLAT_FEE);
  const amountToReceive = formatNaira(total);

  useEffect(() => {
    if (!showCountdown) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [showCountdown]);

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
          onClick={() => router.push("/dashboard")}
          className="w-full flex justify-center items-center bg-[#8cc629] hover:bg-[#7db424] text-white py-4 font-bold text-[12px] uppercase tracking-wider transition-colors"
        >
          I HAVE TRANSFERRED THE MONEY
        </button>
      </div>
    </div>
  );
}
