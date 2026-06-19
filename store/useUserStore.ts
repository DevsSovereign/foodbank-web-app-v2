import { create } from "zustand";
import type { AdminGamifiedEnabled, UserGamification, UserResponse } from "@/types/user";

interface UserStore {
  user: UserResponse | null;
  userEligibles: UserGamification | null;
  adminGamifiedEnabled: AdminGamifiedEnabled | null;
  /** Whether the user has toggled their Spin & Win discount on at checkout. */
  isSpinDiscountApplied: boolean;
}

interface UserStoreActions {
  setUser: (user: UserResponse) => void;
  clearUserStore: () => void;
  setUserEligibles: ({
    adminGamifiedEnabled,
    userEligibles,
  }: Pick<UserStore, "adminGamifiedEnabled" | "userEligibles">) => void;
  setIsSpinDiscountApplied: (isApplied: boolean) => void;
}

export const useUserStore = create<UserStore & UserStoreActions>((set) => ({
  // state
  user: null,
  userEligibles: null,
  adminGamifiedEnabled: null,
  isSpinDiscountApplied: false,

  // actions
  setUser: (user) => set({ user }),

  setUserEligibles: ({ adminGamifiedEnabled, userEligibles }) =>
    set({ adminGamifiedEnabled, userEligibles }),

  setIsSpinDiscountApplied: (isSpinDiscountApplied) => set({ isSpinDiscountApplied }),

  clearUserStore: () => set({ user: null, userEligibles: null, isSpinDiscountApplied: false }),
}));
