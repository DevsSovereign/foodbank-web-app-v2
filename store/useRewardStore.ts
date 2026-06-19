import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { STORAGE_KEYS } from "@/lib/auth-utils";
import type { RewardHistory } from "@/types/user";

interface RewardStore {
  /** Rewards the user selected from their dashboard to apply on their next checkout. */
  selectedRewards: RewardHistory[];
  /** Adds the reward if not already selected, removes it if it is (de-select). */
  toggleSelectedReward: (reward: RewardHistory) => void;
  clearSelectedRewards: () => void;
}

/**
 * Holds the reward(s) a user chose (from Reward History) to use at checkout.
 *
 * Persisted to sessionStorage so a mistaken refresh keeps the selection. They
 * are cleared after a successful checkout so a reward can only be used once.
 */
export const useRewardStore = create<RewardStore>()(
  persist(
    (set) => ({
      selectedRewards: [],
      toggleSelectedReward: (reward) =>
        set((state) => {
          const isSelected = state.selectedRewards.some((r) => r._id === reward._id);
          return {
            selectedRewards: isSelected
              ? state.selectedRewards.filter((r) => r._id !== reward._id)
              : [...state.selectedRewards, reward],
          };
        }),
      clearSelectedRewards: () => set({ selectedRewards: [] }),
    }),
    {
      name: STORAGE_KEYS.APPLIED_REWARD,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
