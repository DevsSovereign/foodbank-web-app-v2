"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export default function LoanHistoryDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params);

  // Mock data to match the image
  const loanData = {
    outstanding: "30,990.00",
    termsLeft: 1,
    overview: {
      unpaidPrincipal: "30,990.00",
      unpaidInterest: "300.00",
      unpaidServiceCharge: "597.00",
      overdueManagementFee: "0.00",
      deliveryFee: "0.00",
    },
    stats: {
      loanAmount: "30,990.00",
      repaidAmount: "0.00",
    },
    repaymentSchedule: [
      { term: "Term 1", dueDate: "Dec 26", amount: "15,990.00" },
      { term: "Term 1", dueDate: "Dec 28", amount: "15,990.00" }, // Mockup shows Term 1 again with Dec 28
    ],
  };

  return (
    <div className="w-full max-w-7xl space-y-6">
      {/* Breadcrumbs - Though handled by Layout/NavBar, following mockup's "Home >" */}
      <div className="flex items-center gap-1 text-xs text-gray-500 mb-2 invisible md:visible">
        <Link href="/" className="hover:text-[#6cc200]">
          Home
        </Link>
        <ChevronRight className="size-3" />
        <span className="text-gray-900 font-medium">Loan details</span>
      </div>

      {/* Header & Terms counter */}
      <div className="flex justify-between items-end mb-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Loan details</h1>
          <p className="text-gray-500 text-sm font-medium mt-2">Outstanding:</p>
        </div>
        <div className="text-gray-400 text-sm mb-1">{loanData.termsLeft} terms left</div>
      </div>

      {/* Outstanding Amount */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">₦ {loanData.outstanding}</h2>
      </div>

      {/* Grid for Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Loan Overview Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-6 font-primary">Loan Overview</h3>

          <div className="space-y-6">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Unpaid Principal:</span>
              <span className="text-gray-900 font-bold">₦{loanData.overview.unpaidPrincipal}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Unpaid Interest:</span>
              <span className="text-gray-900 font-bold">₦{loanData.overview.unpaidInterest}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Unpaid Service Charge:</span>
              <span className="text-gray-900 font-bold">
                ₦{loanData.overview.unpaidServiceCharge}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Overdue Management Fee:</span>
              <span className="text-gray-900 font-bold">
                ₦{loanData.overview.overdueManagementFee}
              </span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500 font-medium">Delivery Fee:</span>
              <span className="text-gray-900 font-bold">₦{loanData.overview.deliveryFee}</span>
            </div>
          </div>
        </div>

        {/* Amount Summary Card */}
        <div className="bg-[#f2fdf7] rounded-2xl p-6 md:p-8 shadow-sm border border-transparent">
          <div className="space-y-10">
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Loan Amount</p>
              <h4 className="text-xl font-bold text-gray-900">₦{loanData.stats.loanAmount}</h4>
            </div>
            <div>
              <p className="text-gray-500 text-sm font-medium mb-1">Repaid Amount:</p>
              <h4 className="text-xl font-bold text-gray-900">₦{loanData.stats.repaidAmount}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Repayment Schedule Card */}
      <div className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-gray-50 mt-6 md:mt-10">
        <h3 className="text-lg font-bold text-gray-900 mb-8 font-primary">Repayment Schedule</h3>

        <div className="divide-y divide-gray-100">
          {loanData.repaymentSchedule.map((item, index) => (
            <div
              key={index}
              className="py-5 flex justify-between items-center first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <div className="size-5 rounded-full border-2 border-gray-300"></div>
                </div>
                <div>
                  <h4 className="text-gray-900 font-bold text-sm md:text-base">{item.term}</h4>
                  <p className="text-gray-400 text-xs mt-0.5">Due {item.dueDate}</p>
                </div>
              </div>
              <div className="text-gray-900 font-bold text-sm md:text-base">₦{item.amount}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Repay Button */}
      <div className="flex justify-center mt-10 md:mt-12">
        <Link
          href={`/dashboard/loan-history/${unwrappedParams.id}/repay`}
          className="w-full md:max-w-md bg-[#8fd41a] hover:bg-[#7bc015] text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-[0.98] text-center"
        >
          Repay
        </Link>
      </div>

      {/* Back Link */}
      <div className="pt-4 flex justify-center">
        <Link
          href="/dashboard/loan-history"
          className="flex items-center gap-2 text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          Back to list
        </Link>
      </div>
    </div>
  );
}
