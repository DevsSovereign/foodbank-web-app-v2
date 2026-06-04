"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";

interface BvnVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
}

export default function BvnVerificationModal({
  isOpen,
  onClose,
  onVerified,
}: BvnVerificationModalProps) {
  const { toast } = useToast();
  const [bvn, setBvn] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleBvnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // BVN is 11 digits
    const val = e.target.value.replace(/\D/g, "");
    if (val.length <= 11) setBvn(val);
  };

  const handleVerify = async () => {
    if (bvn.length !== 11) {
      toast({ variant: "error", title: "Please enter a valid 11-digit BVN." });
      return;
    }

    setIsVerifying(true);
    try {
      // TODO: Replace with the real BVN verification API call once available.
      // e.g. await userService.verifyBvn({ bvn }) -> on success continue below.
      await new Promise((resolve) => setTimeout(resolve, 600));

      toast({ variant: "success", title: "BVN verified successfully" });
      setBvn("");
      onVerified();
    } catch {
      toast({ variant: "error", title: "BVN verification failed. Please try again." });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[550px] overflow-hidden">
        <div className="p-8 space-y-8">
          <h2 className="text-[22px] md:text-[24px] font-bold text-gray-800 text-center">
            Bank Verification Number
          </h2>

          <div className="w-full space-y-2">
            <label className="block text-[14px] font-medium text-gray-700">
              Bank Verification Number
            </label>
            <input
              type="text"
              value={bvn}
              onChange={handleBvnChange}
              placeholder="Enter your correct BVN number"
              className="w-full px-6 py-3.5 bg-white border border-gray-200 rounded-lg text-[16px] focus:outline-none focus:ring-1 focus:ring-[#8cc629] text-gray-600 placeholder:text-gray-400 shadow-sm"
            />
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="w-full bg-[#8cc629] hover:bg-[#7db424] disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-[18px] transition-all active:scale-[0.98] shadow-md"
          >
            {isVerifying ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
