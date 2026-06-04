"use client";

import React, { useState } from "react";
import { useToast } from "@/components/ui/toast/ToastProvider";

interface AmountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (amount: number) => void;
}

export default function AmountModal({ isOpen, onClose, onSubmit }: AmountModalProps) {
  const { toast } = useToast();
  const [amount, setAmount] = useState("");

  if (!isOpen) return null;

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Digits only
    setAmount(e.target.value.replace(/\D/g, ""));
  };

  const handleSubmit = () => {
    const value = Number(amount);
    if (!value || value <= 0) {
      toast({ variant: "error", title: "Please enter a valid amount." });
      return;
    }
    onSubmit(value);
    setAmount("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center  p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Content */}

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-[550px] overflow-hidden">
        <div className="p-4">
          <h2 className="text-[24px] md:text-[28px] font-bold text-gray-800 text-center mb-10">
            Enter Amount
          </h2>

          <div className="w-full mb-10">
            <label className="block text-[18px] text-gray-600 mb-3">Amount to send</label>
            <div className="focus:ring-1 focus:ring-[#8cc629] flex flex-row items-center gap-4 w-full px-5 py-4 bg-white border border-gray-200 rounded-xl">
              <span className="">₦</span>
              <input
                type="text"
                inputMode="numeric"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter the amount you want to send"
                className="w-full text-[16px] focus:outline-none text-gray-600 placeholder:text-gray-400"
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white font-bold py-4 sm:py-5 rounded-xl text-[18px] md:text-[20px] transition-all active:scale-[0.98]"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
