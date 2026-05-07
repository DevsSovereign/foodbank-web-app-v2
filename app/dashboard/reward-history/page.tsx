"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, ArrowRight, X } from "lucide-react";

const rewardHistoryData = [
  {
    id: 1,
    item: "Face Cap",
    order: "#23456",
    status: "Applied to Order #23456",
    date: "12 Jan 2026",
    modalStatus: "Used",
  },
  {
    id: 2,
    item: "0.5% Discount",
    order: "#23456",
    status: "Available for use",
    date: "12 Jan 2026",
    modalStatus: "Active",
  },
  {
    id: 3,
    item: "₦1000 Bonus",
    order: "#23456",
    status: "Applied to Order #23456",
    date: "12 Jan 2026",
    modalStatus: "Used",
  },
];

export default function RewardHistoryPage() {
  const hasRewards = rewardHistoryData.length > 0;
  const [selectedReward, setSelectedReward] = useState<(typeof rewardHistoryData)[0] | null>(null);

  const closeModal = () => setSelectedReward(null);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Reward History</h1>
        <p className="text-gray-500 text-sm">
          Make a purchase of ₦50,000 or more to unlock Spin & Win rewards.
        </p>
      </div>

      {hasRewards ? (
        /* Table Section */
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
              REWARD HISTORY
            </h2>
          </div>

          {/* Desktop View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th
                    className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center"
                    colSpan={2}
                  >
                    ITEM
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    STATUS
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                    DATE
                  </th>
                  <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewardHistoryData.map((reward) => (
                  <tr key={reward.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 w-20">
                      <div className="size-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                        <Gift className="size-5 text-[#2a9d5c]" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 text-center">
                      {reward.item}
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">{reward.status}</td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">{reward.date}</td>
                    <td className="py-4 px-6 text-sm text-right">
                      <button
                        onClick={() => setSelectedReward(reward)}
                        className="text-[#8cc629] font-medium hover:text-[#7ab824] inline-flex items-center gap-1 transition-colors"
                      >
                        View Details <ArrowRight className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {rewardHistoryData.map((reward) => (
              <div key={reward.id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-gray-900">{reward.item}</h3>
                  <span className="text-[10px] text-gray-500">{reward.date}</span>
                </div>
                <p className="text-xs text-gray-500 mb-4">{reward.status}</p>

                <div className="flex justify-between items-center">
                  <span
                    className={`text-sm font-medium ${reward.modalStatus === "Used" ? "text-red-500" : "text-[#2a9d5c]"}`}
                  >
                    {reward.modalStatus}
                  </span>

                  <button
                    onClick={() => setSelectedReward(reward)}
                    className="px-4 py-1.5 rounded border border-[#8cc629] text-[#8cc629] text-xs font-medium hover:bg-[#8cc629] hover:text-white transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Empty State Section */
        <div className="flex flex-col items-center justify-center py-8 md:py-12">
          <div className="mb-4 relative size-32 md:w-40 md:h-40">
            <Image
              src="/assets/reward-history.png"
              alt="No Reward Yet"
              fill
              className="object-contain"
            />
          </div>
          <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1.5">No Reward Yet</h2>
          <p className="text-gray-500 text-xs md:text-sm text-center max-w-[280px]">
            Make a purchase of ₦50,000 or more to unlock Spin & Win rewards.
          </p>
        </div>
      )}

      {/* Reward Details Modal */}
      {selectedReward && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-[400px] overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-[13px] font-bold text-gray-800 uppercase tracking-wide">
                REWARD DETAILS
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 transition-colors rounded-full p-1 hover:bg-gray-100"
              >
                <X className="size-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="bg-[#f0f8f3] rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-center border-b border-[#e2efe6] pb-4">
                  <span className="text-[#2a9d5c] text-[13px] font-medium">Reward:</span>
                  <span className="text-gray-800 text-[13px] font-medium">
                    {selectedReward.item}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#e2efe6] pb-4">
                  <span className="text-[#2a9d5c] text-[13px] font-medium">Order:</span>
                  <span className="text-gray-800 text-[13px] font-medium">
                    {selectedReward.order}
                  </span>
                </div>
                <div className="flex justify-between items-center border-b border-[#e2efe6] pb-4">
                  <span className="text-[#2a9d5c] text-[13px] font-medium">Won On:</span>
                  <span className="text-gray-800 text-[13px] font-medium">
                    {selectedReward.date}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2a9d5c] text-[13px] font-medium">Status:</span>
                  <span
                    className={`text-[13px] font-medium ${selectedReward.modalStatus === "Used" ? "text-red-500" : "text-gray-800"}`}
                  >
                    {selectedReward.modalStatus}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
