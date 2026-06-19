"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Gift, ArrowRight, X, Loader2, Check } from "lucide-react";
import { useGetRewardHistory } from "@/lib/queries";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { useRewardStore } from "@/store/useRewardStore";
import type { RewardHistory } from "@/types/user";

const formatDate = (value?: string) =>
  value
    ? new Date(value).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "—";

const isActiveStatus = (status?: RewardHistory["status"]) => status === "active";

function StatusBadge({ status }: { status: RewardHistory["status"] }) {
  const isActive = isActiveStatus(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
        isActive ? "bg-[#e8f5e9] text-[#2a9d5c]" : "bg-red-50 text-red-500"
      }`}
    >
      <span className={`size-1.5 rounded-full ${isActive ? "bg-[#2a9d5c]" : "bg-red-500"}`} />
      {status}
    </span>
  );
}

export default function RewardHistoryPage() {
  const { data: rewardHistoryData, isLoading: rewardHistoryLoading } = useGetRewardHistory();
  const [selectedReward, setSelectedReward] = useState<RewardHistory | null>(null);
  const { toast } = useToast();
  const selectedRewards = useRewardStore((state) => state.selectedRewards);
  const toggleSelectedReward = useRewardStore((state) => state.toggleSelectedReward);

  const rewards = rewardHistoryData?.items ?? [];
  const hasRewards = rewards.length > 0;

  const isRewardSelected = (reward: RewardHistory) =>
    selectedRewards.some((r) => r._id === reward._id);

  const closeModal = () => setSelectedReward(null);

  // Selecting a reward stores it for the next checkout, where it is consumed
  // (via the order's gamified payload) and then cleared. Toggling again
  // de-selects it. Multiple rewards can be selected at once.
  const handleToggleReward = (reward: RewardHistory) => {
    const wasSelected = isRewardSelected(reward);
    toggleSelectedReward(reward);
    toast({
      variant: "success",
      title: wasSelected
        ? "Reward removed from your next checkout"
        : "Reward selected — it will be applied at your next checkout",
    });
    closeModal();
  };

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Reward History</h1>
        <p className="text-gray-500 text-sm">
          Make a purchase of ₦50,000 or more to unlock Spin & Win rewards.
        </p>
      </div>

      {rewardHistoryLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="size-8 text-[#8cc629] animate-spin" />
        </div>
      ) : hasRewards ? (
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
                {rewards.map((reward) => (
                  <tr key={reward._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6 w-20">
                      <div className="size-10 rounded-full bg-[#e8f5e9] flex items-center justify-center">
                        <Gift className="size-5 text-[#2a9d5c]" />
                      </div>
                    </td>
                    <td className="py-4 px-6 text-sm font-medium text-gray-900 text-center">
                      {reward.displayLabel || reward.reward}
                    </td>
                    <td className="py-4 px-6 text-sm text-center">
                      <StatusBadge status={reward.status} />
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-500 text-center">
                      {formatDate(reward.wonOn)}
                    </td>
                    <td className="py-4 px-6 text-sm text-right">
                      <div className="inline-flex items-center gap-3">
                        {isRewardSelected(reward) && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2.5 py-1 text-xs font-semibold text-[#2a9d5c]">
                            <Check className="size-3" /> Selected
                          </span>
                        )}
                        <button
                          onClick={() => setSelectedReward(reward)}
                          className="text-[#8cc629] font-medium hover:text-[#7ab824] inline-flex items-center gap-1 transition-colors"
                        >
                          View Details <ArrowRight className="size-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            {rewards.map((reward) => (
              <div key={reward._id} className="p-4 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-gray-900">
                    {reward.displayLabel || reward.reward}
                  </h3>
                  <span className="text-[10px] text-gray-500">{formatDate(reward.wonOn)}</span>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-2">
                    <StatusBadge status={reward.status} />
                    {isRewardSelected(reward) && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#e8f5e9] px-2 py-0.5 text-[10px] font-semibold text-[#2a9d5c]">
                        <Check className="size-3" /> Selected
                      </span>
                    )}
                  </div>

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
                    {selectedReward.displayLabel || selectedReward.reward}
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
                    {formatDate(selectedReward.wonOn)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#2a9d5c] text-[13px] font-medium">Status:</span>
                  <StatusBadge status={selectedReward.status} />
                </div>
              </div>

              {/* Use / Remove toggle — only for active rewards */}
              {isActiveStatus(selectedReward.status) &&
                (isRewardSelected(selectedReward) ? (
                  <button
                    onClick={() => handleToggleReward(selectedReward)}
                    className="mt-6 w-full bg-red-50 hover:bg-red-100 text-red-600 font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Remove from Checkout
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleReward(selectedReward)}
                    className="mt-6 w-full bg-[#8cc629] hover:bg-[#7ab824] text-white font-bold py-3 rounded-lg text-sm transition-colors flex items-center justify-center gap-2"
                  >
                    Use Reward
                  </button>
                ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
