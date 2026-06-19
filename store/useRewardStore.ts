import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/auth-utils";
import type { RewardHistory } from "@/types/user";

interface RewardStore {
  /** The reward the user selected to apply on their next checkout, if any. */
  appliedReward: RewardHistory | null;
  setAppliedReward: (reward: RewardHistory | null) => void;
  clearAppliedReward: () => void;
}

/**
 * Holds the reward a user chose (from Reward History) to use at checkout.
 *
 * Persisted to sessionStorage so a mistaken refresh keeps the selection. It is
 * cleared after a successful checkout so a reward can only ever be used once.
 */
export const useRewardStore = create<RewardStore>()(
  persist(
    (set) => ({
      appliedReward: null,
      setAppliedReward: (appliedReward) => set({ appliedReward }),
      clearAppliedReward: () => set({ appliedReward: null }),
    }),
    {
      name: STORAGE_KEYS.APPLIED_REWARD,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
