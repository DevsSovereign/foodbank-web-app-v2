import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export default function RepaymentHistoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const unwrappedParams = React.use(params);

  return (
    <div className="w-full max-w-3xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Repayment History</h1>
        <p className="text-gray-500 text-sm">View history of loan details</p>
      </div>

      {/* Main Content Area */}
      <div className="bg-transparent sm:bg-white sm:rounded-2xl sm:p-10 sm:shadow-sm sm:border sm:border-gray-100">
        {/* Title & Status */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-8 sm:bg-transparent sm:p-0 sm:shadow-none sm:border-none sm:mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-start items-center justify-center text-center sm:text-left gap-3">
          <div className="size-12 sm:w-10 sm:h-10 rounded-full bg-orange-50 flex items-center justify-center shrink-0 mb-2 sm:mb-0">
            <FileText className="size-6 sm:w-5 sm:h-5 text-orange-500" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <h2 className="text-sm sm:text-xl font-medium sm:font-bold text-gray-900">
              Initial Repayment
            </h2>
            <div className="block sm:hidden mb-1">
              <h3 className="text-xl font-bold text-gray-900">₦30,000.00</h3>
            </div>
            <span className="text-[#2a9d5c] text-[10px] sm:text-sm font-medium bg-[#e8f5e9] px-3 py-1 rounded-full inline-block w-fit mx-auto sm:mx-0">
              Success
            </span>
          </div>
        </div>

        {/* Amount (Desktop Only) */}
        <div className="hidden sm:block mb-10">
          <h3 className="text-3xl font-bold text-gray-900">₦10,670.00</h3>
        </div>

        {/* Loan Overview Section */}
        <div className="mb-8">
          <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Loan Overview
          </h4>
          <div className="space-y-4 px-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Initial Payment:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">₦30,990.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Interest:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">₦300.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Over Interest:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">₦567.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Service Fee:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">₦0.00</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Extension Fee:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">₦0.00</span>
            </div>
          </div>
        </div>

        {/* Basic Information Section */}
        <div className="mb-8">
          <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-4 pb-2 border-b border-gray-100">
            Basic Information
          </h4>
          <div className="space-y-4 px-1">
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Receiving Account:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">73698490(Paystack)</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Start and End date:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">
                29th Mar 25 - 9th Apr 25
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Loan Days:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">10 days</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-xs sm:text-sm">Daily Interest Fee:</span>
              <span className="text-gray-900 text-xs sm:text-sm font-bold">1%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="mt-6">
        <Link
          href="/dashboard/repayment-history"
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 transition-colors text-sm font-medium"
        >
          <ArrowLeft className="size-4" />
          Back to Repayment History
        </Link>
      </div>
    </div>
  );
}
