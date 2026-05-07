"use client";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight, FileText, Loader2 } from "lucide-react";
import { useGetAllRepayment } from "@/lib/queries";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import EmptyState from "@/components/ui/EmptyState";

// Dummy data for the table
const repaymentHistoryData = [
  { id: 1, date: "01st Oct 2025, 08:30 PM", amount: "₦15,990.00" },
  { id: 2, date: "01st Oct 2025, 08:30 PM", amount: "₦15,990.00" },
  { id: 3, date: "01st Oct 2025, 08:30 PM", amount: "₦15,990.00" },
];

export default function RepaymentHistoryPage() {
  const {
    data: repayments,
    isLoading: repaymentLoading,
    error: repaymentError,
  } = useGetAllRepayment();

  // console.log(repayments);

  if (repaymentError) {
    return <ErrorSection message={handleError(repaymentError)} />;
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Repayment History</h1>
        <p className="text-gray-500 text-sm">Select installment and payment method</p>
      </div>

      {/* Table Section */}
      <div className="bg-transparent sm:bg-white sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
        <div className="hidden sm:block p-6 border-b border-gray-100">
          <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
            REPAYMENT HISTORY
          </h2>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          {repaymentLoading ? (
            <Loader2 className="size-5 animate-spin m-4" />
          ) : !repayments ? (
            <EmptyState message="No repayment history found" />
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="py-4 px-6 w-20"></th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    DATE AND TIME
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    AMOUNT
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {repaymentHistoryData.map((repayment) => (
                  <tr key={repayment.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="size-10 rounded-full bg-orange-50 flex items-center justify-center">
                        <FileText className="size-5 text-orange-500" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{repayment.date}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 text-center">
                      {repayment.amount}
                    </td>
                    <td className="py-4 px-6 text-sm text-right">
                      <Link
                        href={`/dashboard/repayment-history/${repayment.id}`}
                        className="text-[#8cc629] font-medium hover:text-[#7ab824] inline-flex items-center gap-1"
                      >
                        View Details <ArrowRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Mobile List View */}
        <div className="sm:hidden flex flex-col bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="divide-y divide-gray-100">
            {repaymentHistoryData.map((repayment) => (
              <div key={repayment.id} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div className="size-12 rounded-full bg-orange-50 flex items-center justify-center shrink-0">
                    <FileText className="size-6 text-orange-500" />
                  </div>

                  {/* Details */}
                  <div className="flex flex-col">
                    <span className="text-base font-bold text-gray-900 mb-1">
                      {repayment.amount}
                    </span>
                    <span className="text-[11px] text-gray-500">{repayment.date}</span>
                  </div>
                </div>

                {/* Action Button */}
                <Link
                  href={`/dashboard/repayment-history/${repayment.id}`}
                  className="text-[#8cc629] text-[10px] font-medium border border-[#8cc629] rounded px-3 py-1.5 hover:bg-[#f0f7e6] transition-colors whitespace-nowrap"
                >
                  View Details
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-8 gap-2">
          <button className="size-8 rounded-full border border-orange-400 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors">
            <ChevronLeft className="size-4" />
          </button>

          <button className="size-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-sm font-medium">
            01
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            02
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            03
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            04
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            05
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            06
          </button>

          <button className="size-8 rounded-full border border-orange-400 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
