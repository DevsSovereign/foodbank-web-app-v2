"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Copy, CreditCard } from "lucide-react";

interface Installment {
  id: string;
  label: string;
  amount: number;
}

export default function LoanRepaymentPage() {
  // Mock data based on the provided mockup
  const installments: Installment[] = [
    { id: "inst_1", label: "1st Installment", amount: 15990.0 },
    { id: "inst_2", label: "1st Installment", amount: 15990.0 }, // Matches mockup showing another "1st Installment" at bottom
  ];

  const [selectedInstallmentIds, setSelectedInstallmentIds] = useState<string[]>(["inst_1"]);
  const [paymentMethod, setPaymentMethod] = useState<"wallet" | "card">("wallet");
  const [copied, setCopied] = useState(false);

  const repaymentAmount = useMemo(() => {
    if (selectedInstallmentIds.length === 0) return "";
    const total = selectedInstallmentIds.reduce((sum, id) => {
      const inst = installments.find((i) => i.id === id);
      return sum + (inst?.amount || 0);
    }, 0);
    return total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }, [installments, selectedInstallmentIds]);

  const toggleInstallment = (id: string) => {
    setSelectedInstallmentIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleCopy = () => {
    navigator.clipboard.writeText("9843268434");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-5xl pb-10">
      {/* Header section matches details page style natively, but we follow mockup here */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Loan Repayment</h1>
        <p className="text-gray-500 text-sm">Select installment and payment method</p>
      </div>

      <div className="space-y-6">
        {/* Installments Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Installments</h3>

          <div className="space-y-3">
            {installments.map((inst, index) => {
              const isSelected = selectedInstallmentIds.includes(inst.id);
              return (
                <div
                  key={`${inst.id}-${index}`}
                  onClick={() => toggleInstallment(inst.id)}
                  className={`flex justify-between items-center p-4 rounded-xl cursor-pointer transition-colors border ${
                    isSelected
                      ? "bg-[#f4faec] border-transparent"
                      : "bg-white border-transparent hover:border-gray-100" // Keeping it clean, mockup showed white back for unselected
                  }`}
                >
                  <div>
                    <p className="text-sm font-medium text-gray-500 mb-1">{inst.label}</p>
                    <p className="font-bold text-gray-900">
                      ₦{inst.amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  {/* Custom Checkbox */}
                  <div
                    className={`size-5 rounded-md flex items-center justify-center border transition-all ${
                      isSelected
                        ? "bg-[#8fd41a] border-[#8fd41a]"
                        : "bg-transparent border-gray-300"
                    }`}
                  >
                    {isSelected && <Check className="size-3.5 text-white" strokeWidth={3} />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Specific Repayment Amount Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Specific Repayment Amount</h3>

          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400 font-medium">₦</div>
            <input
              type="text"
              value={repaymentAmount}
              readOnly
              placeholder="Select installment and payment method"
              className="w-full h-14 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-1 focus:ring-[#8fd41a] placeholder:text-gray-400 text-sm"
            />
          </div>
        </div>

        {/* Choose Payment Method Section */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <h3 className="text-sm font-bold text-gray-900 mb-4">
            Choose Payment Method <span className="text-gray-400 font-normal ml-1">(PAY WITH)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Wallet Option */}
            <button
              onClick={() => setPaymentMethod("wallet")}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                paymentMethod === "wallet"
                  ? "bg-[#f4faec] border-[#8fd41a]"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`size-4 rounded-full flex items-center justify-center border ${
                  paymentMethod === "wallet" ? "border-[#8fd41a]" : "border-gray-300"
                }`}
              >
                {paymentMethod === "wallet" && (
                  <div className="size-2 rounded-full bg-[#8fd41a]" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">Wallet</span>
            </button>

            {/* Card Option */}
            <button
              onClick={() => setPaymentMethod("card")}
              className={`flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                paymentMethod === "card"
                  ? "bg-[#f4faec] border-[#8fd41a]"
                  : "bg-white border-gray-100 hover:border-gray-200"
              }`}
            >
              <div
                className={`size-4 rounded-full flex items-center justify-center border ${
                  paymentMethod === "card" ? "border-[#8fd41a]" : "border-gray-300"
                }`}
              >
                {paymentMethod === "card" && <div className="size-2 rounded-full bg-[#8fd41a]" />}
              </div>
              <span className="text-sm font-medium text-gray-700">Card</span>
            </button>
          </div>
        </div>

        {/* Conditional Details Section */}
        {paymentMethod === "wallet" ? (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 transition-all opacity-100 translate-y-0">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Virtual Account Details</h3>

            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-gray-500 mb-1">Account Number</p>
                <p className="text-base font-bold text-gray-900">9843268434</p>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-[#8fd41a] hover:text-[#7bc015] transition-colors"
                title="Copy Account Number"
              >
                <span className="text-sm font-medium">{copied ? "Copied!" : "Copy"}</span>
                <Copy className="size-4" />
              </button>
            </div>

            <div>
              <p className="text-sm text-gray-500 mb-1">Bank Name</p>
              <p className="text-base font-bold text-gray-900">Paystack-Titan</p>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 transition-all opacity-100 translate-y-0 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-sm font-bold text-gray-900 mb-6">Saved Cards</h3>

            {/* Mock Saved Card UI - Based on typical patterns, updateable once screenshot provided */}
            <div className="border border-gray-100 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-[#8fd41a] transition-colors bg-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-blue-50/50 border border-blue-100 rounded flex items-center justify-center">
                  <CreditCard className="size-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">**** **** **** 4242</p>
                  <p className="text-xs text-gray-500">Expires 12/28</p>
                </div>
              </div>

              <div className="size-5 rounded-full border border-[#8fd41a] flex items-center justify-center">
                <div className="size-2.5 rounded-full bg-[#8fd41a]" />
              </div>
            </div>

            <button className="mt-4 text-sm font-medium text-[#8fd41a] hover:text-[#7bc015] transition-colors flex items-center gap-1.5">
              + Add New Card
            </button>
          </div>
        )}
      </div>

      {/* Repay Button Action */}
      <div className="mt-8 sm:mt-10">
        <button
          className="w-full md:max-w-md mx-auto block bg-[#8fd41a] hover:bg-[#7bc015] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            !repaymentAmount ||
            parseFloat(repaymentAmount.replace(/,/g, "")) <= 0 ||
            isNaN(parseFloat(repaymentAmount.replace(/,/g, "")))
          }
        >
          Repay
        </button>
      </div>

      {/* Back Link Option */}
      <div className="pt-6 flex justify-center">
        <Link
          href="/dashboard/loan-history"
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          Cancel
        </Link>
      </div>
    </div>
  );
}
