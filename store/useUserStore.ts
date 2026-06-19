import { create } from "zustand";
import type {
  AdminGamifiedEnabled,
  GamificationRewardType,
  UserGamification,
  UserResponse,
} from "@/types/user";

/** Which gamification rewards the user has toggled on to use at checkout. */
type RewardsToUse = Record<GamificationRewardType, boolean>;

interface UserStore {
  user: UserResponse | null;
  /** Whether a user is eligible for gamifications. */
  userEligibles: UserGamification | null;
  /** Whether admin enabled gamifications. */
  adminGamifiedEnabled: AdminGamifiedEnabled | null;
  /** Offers the option to immediately use claimed rewards */
  rewardsToUse: RewardsToUse;
}

interface UserStoreActions {
  setUser: (user: UserResponse) => void;
  clearUserStore: () => void;
  setUserEligibles: ({
    adminGamifiedEnabled,
    userEligibles,
  }: Pick<UserStore, "adminGamifiedEnabled" | "userEligibles">) => void;
  /** Helps to toggle the option to immediately use claimed rewards */
  toggleRewardToUse: (type: GamificationRewardType, value: boolean) => void;
}

const NO_REWARDS_TO_USE: RewardsToUse = {
  discountSpin: false,
  freeDelivery: false,
  promoCode: false,
};

export const useUserStore = create<UserStore & UserStoreActions>((set) => ({
  // state
  user: null,
  userEligibles: null,
  adminGamifiedEnabled: null,
  rewardsToUse: NO_REWARDS_TO_USE,

  // actions
  setUser: (user) => set({ user }),

  setUserEligibles: ({ adminGamifiedEnabled, userEligibles }) =>
    set({ adminGamifiedEnabled, userEligibles }),

  toggleRewardToUse: (type, value) =>
    set((state) => ({ rewardsToUse: { ...state.rewardsToUse, [type]: value } })),

  clearUserStore: () =>
    set({ user: null, userEligibles: null, rewardsToUse: NO_REWARDS_TO_USE }),
}));
