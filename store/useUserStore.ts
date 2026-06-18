import { create } from "zustand";
import type { AdminGamifiedEnabled, UserGamification, UserResponse } from "@/types/user";

interface UserStore {
  user: UserResponse | null;
  userEligibles: UserGamification | null;
  adminGamifiedEnabled: AdminGamifiedEnabled | null;
}

interface UserStoreActions {
  setUser: (user: UserResponse) => void;
  clearUserStore: () => void;
  setUserEligibles: ({ adminGamifiedEnabled, userEligibles }: Omit<UserStore, "user">) => void;
}

export const useUserStore = create<UserStore & UserStoreActions>((set) => ({
  // state
  user: null,
  userEligibles: null,
  adminGamifiedEnabled: null,

  // actions
  setUser: (user) => set({ user }),

  setUserEligibles: ({ adminGamifiedEnabled, userEligibles }) =>
    set({ adminGamifiedEnabled, userEligibles }),

  clearUserStore: () => set({ user: null, userEligibles: null }),
}));
