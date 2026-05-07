"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ArrowRight,
  Check,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

// Dummy data for the table
const loanHistoryData = [
  {
    id: 1,
    type: "Received Loan",
    status: "Pending",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 2,
    type: "Repaid Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 3,
    type: "Repaid Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 4,
    type: "Repaid Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 5,
    type: "Repaid Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 6,
    type: "Received Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 7,
    type: "Received Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 8,
    type: "Received Loan",
    status: "Confirmed",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
  {
    id: 9,
    type: "Repaid Loan",
    status: "Cancelled",
    date: "01st Oct 2025, 08:30 PM",
    amount: "₦8,500.00",
  },
];

const getStatusStyles = (status: string) => {
  switch (status) {
    case "Pending":
      return {
        text: "text-orange-500",
        badgeBg: "bg-orange-50",
        iconBg: "bg-[#f97316]",
        iconOuterBg: "bg-orange-50",
        Icon: Clock,
      };
    case "Confirmed":
      return {
        text: "text-[#2a9d5c]",
        badgeBg: "bg-[#e8f5e9]",
        iconBg: "bg-[#2a9d5c]",
        iconOuterBg: "bg-[#e8f5e9]",
        Icon: CheckCircle2,
      };
    case "Cancelled":
      return {
        text: "text-red-500",
        badgeBg: "bg-red-50",
        iconBg: "bg-red-500",
        iconOuterBg: "bg-red-50",
        Icon: XCircle,
      };
    default:
      return {
        text: "text-gray-500",
        badgeBg: "bg-gray-100",
        iconBg: "bg-gray-500",
        iconOuterBg: "bg-gray-100",
        Icon: Clock,
      };
  }
};

export default function LoanHistoryPage() {
  const [filterStatus, setFilterStatus] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter the data based on selected status
  const filteredLoans = loanHistoryData.filter((loan) => {
    if (filterStatus === "All") return true;
    return loan.status === filterStatus;
  });

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Loan History</h1>
          <p className="text-gray-500 text-sm">View history of all your loans</p>
        </div>

        {/* Filter Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`p-2 border rounded-lg transition-colors shadow-sm flex items-center gap-2 ${
              filterStatus !== "All"
                ? "border-[#8cc629] bg-[#f0f7e6] text-[#8cc629]"
                : "border-gray-200 bg-white hover:bg-gray-50 text-gray-600"
            }`}
          >
            <SlidersHorizontal className="size-4" />
            {filterStatus !== "All" && (
              <span className="text-xs font-medium pr-1">{filterStatus}</span>
            )}
          </button>

          {isFilterOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsFilterOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      setFilterStatus(status);
                      setIsFilterOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 flex items-center justify-between transition-colors"
                  >
                    <span
                      className={
                        filterStatus === status ? "text-[#8cc629] font-medium" : "text-gray-700"
                      }
                    >
                      {status}
                    </span>
                    {filterStatus === status && <Check className="size-4 text-[#8cc629]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="size-5 text-[#8cc629]" />
        </div>
        <input
          type="text"
          placeholder="Search..."
          className="block w-full pl-10 pr-3 py-3 border border-[#8cc629] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#8cc629] focus:border-[#8cc629] sm:text-sm bg-white"
        />
      </div>

      {/* Table Section (Desktop) / Cards (Mobile) */}
      <div className="bg-transparent sm:bg-white sm:rounded-xl sm:shadow-sm sm:border sm:border-gray-100 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  TYPE
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  STATUS
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  DATE/TIME
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  AMOUNT
                </th>
                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  ACTION
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{loan.type}</td>
                    <td
                      className={`py-4 px-6 text-sm font-medium ${getStatusStyles(loan.status).text}`}
                    >
                      {loan.status}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500">{loan.date}</td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900">{loan.amount}</td>
                    <td className="py-4 px-6 text-sm">
                      <Link
                        href={`/dashboard/loan-history/${loan.id}`}
                        className="text-[#8cc629] font-medium hover:text-[#7ab824] inline-flex items-center gap-1"
                      >
                        View Details <ArrowRight className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500 text-sm">
                    No loans found for the selected status.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="sm:hidden flex flex-col gap-4">
          {filteredLoans.length > 0 ? (
            filteredLoans.map((loan) => {
              const styles = getStatusStyles(loan.status);
              const StatusIcon = styles.Icon;
              return (
                <Link
                  href={`/dashboard/loan-history/${loan.id}`}
                  key={loan.id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-4"
                >
                  {/* Icon */}
                  <div
                    className={`size-12 rounded-full ${styles.iconBg} flex items-center justify-center shrink-0`}
                  >
                    {loan.status === "Pending" ? (
                      <div className="flex gap-0.5">
                        <div className="size-1.5 rounded-full bg-white"></div>
                        <div className="size-1.5 rounded-full bg-white"></div>
                        <div className="size-1.5 rounded-full bg-white"></div>
                      </div>
                    ) : (
                      <StatusIcon className="size-6 text-white" />
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-base font-bold text-gray-900 truncate pr-2">
                        {loan.type}
                      </h3>
                      <span className="text-sm font-bold text-gray-900 shrink-0">
                        {loan.amount}
                      </span>
                    </div>

                    <div className="flex justify-between items-center mt-2">
                      <p className="text-xs text-gray-500">{loan.date}</p>
                      <span
                        className={`${styles.badgeBg} ${styles.text} text-[10px] font-medium px-2.5 py-1 rounded-full`}
                      >
                        {loan.status}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="bg-white rounded-xl p-8 text-center text-gray-500 text-sm border border-gray-100">
              No loans found for the selected status.
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center py-6 gap-2">
          <button className="size-8 rounded-full border border-orange-400 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors">
            <ChevronLeft className="size-4" />
          </button>

          <button className="size-8 rounded-full bg-orange-400 text-white flex items-center justify-center text-sm font-medium">
            1
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            2
          </button>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            3
          </button>
          <span className="text-gray-400 px-1">...</span>
          <button className="size-8 rounded-full text-gray-500 hover:bg-gray-100 flex items-center justify-center text-sm font-medium transition-colors">
            10
          </button>

          <button className="size-8 rounded-full border border-orange-400 flex items-center justify-center text-orange-400 hover:bg-orange-50 transition-colors">
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
