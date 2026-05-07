"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Share2, Gift, ArrowRight } from "lucide-react";
import { useUserStore } from "@/store/useUserStore";
import { formatCurrency } from "@/functions/formatCurrency";

export default function VerifiedDashboardPage() {
  const [activeTab, setActiveTab] = useState("Wallet");
  const { user } = useUserStore();

  const transactions = Array(6).fill({
    event: "Wallet Funded",
    time: "02:37:33 AM",
    date: "12/12/2025",
    amount: "+ ₦ 2,000",
  });

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
        <div className="lg:col-span-2 relative overflow-hidden rounded-xl bg-linear-to-r from-[#4ca16a] to-[#73b537] p-6 text-white shadow-sm">
          <div className="absolute -bottom-20 right-10 size-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex bg-white/20 rounded-lg p-1 mb-8 w-fit">
              {["Wallet", "Credit Limit", "Loans"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab
                      ? "bg-white text-[#6cc200] shadow-sm"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm font-medium opacity-90 mb-1">
                  {activeTab === "Loans" ? "Total amount owed today" : "Wallet Balance"}
                </p>
                <div className="flex items-center gap-2 mb-8">
                  <h2 className="text-4xl font-bold tracking-tight">₦ 40,000</h2>
                  {activeTab === "Loans" && (
                    <div className="size-5 rounded-full bg-[#8cc629] flex items-center justify-center text-[10px] font-bold border border-white/30">
                      1/2
                    </div>
                  )}
                </div>

                {activeTab === "Loans" && (
                  <div className="w-48 h-1 bg-white/30 rounded-full mb-6 -mt-5">
                    <div className="w-1/3 h-full bg-white rounded-full"></div>
                  </div>
                )}

                <div className="flex gap-4">
                  <button className="bg-[#8cc629] hover:bg-[#7db424] text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                    Fund wallet
                  </button>
                  <button className="bg-white hover:bg-gray-50 text-[#8cc629] px-6 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm">
                    {activeTab === "Loans" ? "Apply Now" : "Order Now"}
                  </button>
                </div>
              </div>
              <div className="hidden sm:block opacity-80 mb-12 mr-8">
                <Image
                  src="/assets/solar_wallet-outline.png"
                  alt="Wallet"
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="relative overflow-hidden rounded-xl bg-linear-to-br from-[#6a9bc3] to-[#5a8bb3] p-6 text-white shadow-sm flex flex-col justify-between">
          <div className="relative z-10">
            <p className="text-sm font-medium opacity-90 mb-1">Referral Earnings</p>
            <h2 className="text-4xl font-bold tracking-tight mb-8">
              {formatCurrency(user?.referralBonusBalance ?? 0)}
            </h2>
          </div>

          <div className="relative z-10 bg-white/10 rounded-xl p-4 border border-white/20">
            <div className="flex items-center gap-2 mb-4">
              <Gift size={18} className="opacity-80" />
              <span className="text-sm font-medium">{user?.referredCustomers.length ?? 0} Total Referred</span>
            </div>
            <button className="w-full bg-white hover:bg-gray-50 text-[#5a8bb3] px-4 py-2.5 rounded-lg text-sm font-bold transition-colors shadow-sm flex items-center justify-center gap-2">
              <Share2 size={16} />
              Invite Friends
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-sm font-bold text-gray-800 tracking-wider">TRANSACTION HISTORY</h3>
          <Link
            href="#"
            className="flex items-center gap-1 text-[#f27a22] text-sm font-medium hover:underline"
          >
            Next <ArrowRight size={16} />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 text-xs text-gray-500 font-medium">
                <th className="px-6 py-4">EVENT</th>
                <th className="px-6 py-4">TIME</th>
                <th className="px-6 py-4">DATE</th>
                <th className="px-6 py-4 text-right">AMOUNT</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((tx, index) => (
                <tr key={index} className="hover:bg-gray-50/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-[#f0f7e6] flex items-center justify-center">
                        <Image
                          src="/assets/solar_circle-top-up-linear.png"
                          alt="Top up"
                          width={16}
                          height={16}
                        />
                      </div>
                      <span className="text-sm text-gray-700 font-medium">{tx.event}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.time}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#8cc629] text-right">
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">Showing 1 - 10 transactions of 1230 Transactions</p>
          <div className="flex gap-2">
            <button className="px-4 py-2 border border-gray-200 rounded-md text-xs font-medium text-gray-400 cursor-not-allowed">
              Previous
            </button>
            <button className="px-4 py-2 border border-gray-200 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
