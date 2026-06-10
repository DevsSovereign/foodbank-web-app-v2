import { create } from "zustand";
import type { UserGamification, UserResponse } from "@/types/user";

interface UserStore {
  user: UserResponse | null;
  userEligibles: UserGamification | null;
}

interface UserStoreActions {
  setUser: (user: UserResponse) => void;
  clearUserStore: () => void;
  setUserEligibles: (userEligibles: UserGamification) => void;
}

export const useUserStore = create<UserStore & UserStoreActions>((set) => ({
  // state
  user: null,
  userEligibles: null,

  // actions
  setUser: (user) => set({ user }),
  setUserEligibles: (userEligibles) => set({ userEligibles }),
  clearUserStore: () => set({ user: null, userEligibles: null }),
}));
