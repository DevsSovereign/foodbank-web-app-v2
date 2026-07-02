"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AmountModal from "@/components/dashboard/AmountModal";
// import BvnVerificationModal from "@/components/dashboard/BvnVerificationModal";

type Flow = "temporary" | "permanent";

export default function FundWalletPage() {
  const router = useRouter();
  const [amountModalFlow, setAmountModalFlow] = useState<Flow | null>(null);
  // const [isBvnModalOpen, setIsBvnModalOpen] = useState(false);
  // const [pendingAmount, setPendingAmount] = useState<number | null>(null);

  const handleAmountSubmit = (amount: number) => {
    const flow = amountModalFlow;
    setAmountModalFlow(null);

    if (flow === "temporary") {
      router.push(`/dashboard/fund-wallet/temporary?amount=${amount}`);
    }
    // else if (flow === "permanent") {
    //   // Permanent requires BVN verification before showing the account details.
    //   setPendingAmount(amount);
    //   setIsBvnModalOpen(true);
    // }
  };

  return (
    <div className="w-full max-w-4xl">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Choose Payment Account</h1>

      <div className="space-y-6">
        {/* Permanent Virtual Account */}
        {/* <div className="bg-[#f6f9f1] rounded-xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Permanent Virtual Account</h2>
          <p className="text-gray-600 text-sm mb-2">Permanent Virtual Account</p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-6">
            <li>Requires BVN verification</li>
            <li>Account remains active for future purchases</li>
            <li>Pay anytime using bank transfer</li>
          </ul>
          <button
            onClick={() => setAmountModalFlow("permanent")}
            className="max-w-full md:max-w-[50%] w-full bg-[#8cc629] hover:bg-[#7db424] text-white py-4 rounded-lg font-bold text-sm transition-colors shadow-sm"
          >
            Process with Permanent
          </button>
        </div> */}

        {/* Temporary Virtual Account */}
        <div className="bg-[#f6f9f1] rounded-xl p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-800 mb-2">Temporary Virtual Account</h2>
          <p className="text-gray-600 text-sm mb-4">
            Generate a one-time account number for this payment.
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600 mb-6">
            <li>No BVN required</li>
            {/* <li>Account expires after 15 minutes</li> */}
            <li>Valid for a single transaction</li>
          </ul>
          <button
            onClick={() => setAmountModalFlow("temporary")}
            className="max-w-full md:max-w-[50%] w-full bg-[#8cc629] hover:bg-[#7db424] text-white py-4 rounded-lg font-bold text-sm transition-colors shadow-sm"
          >
            Process with Temporary
          </button>
        </div>
      </div>

      <AmountModal
        isOpen={amountModalFlow !== null}
        onClose={() => setAmountModalFlow(null)}
        onSubmit={handleAmountSubmit}
      />

      {/* <BvnVerificationModal
        isOpen={isBvnModalOpen}
        onClose={() => setIsBvnModalOpen(false)}
        onVerified={() => {
          setIsBvnModalOpen(false);
          router.push(`/dashboard/fund-wallet/permanent?amount=${pendingAmount}`);
        }}
      /> */}
    </div>
  );
}
