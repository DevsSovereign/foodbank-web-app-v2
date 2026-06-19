import { getFromStorage } from "./auth-utils";
import type { GamificationRewardType, RewardHistory, SpinFunction } from "@/types/user";

/** Discount-line label shown for each reward type at checkout/cart. */
export const REWARD_DISCOUNT_LABELS: Record<GamificationRewardType, string> = {
  discountSpin: "Spin & Win Discount",
  freeDelivery: "Free Delivery Discount",
  promoCode: "Promo Code Discount",
};

/** Reads the won Spin & Win reward (a SpinFunction) from session storage, if any. */
export function getSpinnedReward(): SpinFunction | null {
  const raw = getFromStorage("SPINNED_ITEM");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as SpinFunction;
  } catch {
    return null;
  }
}

/** Reads the won Free Delivery reward from session storage, if any. */
export function getFreeDeliveryReward(): RewardHistory | null {
  const raw = getFromStorage("FREE_DELIVERY");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RewardHistory;
  } catch {
    return null;
  }
}

/** Reads the won Promo Code reward from session storage, if any. */
export function getPromoReward(): RewardHistory | null {
  const raw = getFromStorage("PROMO_CODE");
  if (!raw) return null;

  try {
    return JSON.parse(raw) as RewardHistory;
  } catch {
    return null;
  }
}

/**
 * Resolves the naira discount a Spin & Win reward grants against a given total.
 * - "Fixed Amount": the raw `value` (in naira).
 * - Percentage scopes: `value`% of the supplied total.
 * The discount is never allowed to exceed the total.
 */
export function getSpinDiscount(reward: SpinFunction | null, total: number): number {
  if (!reward) return 0;

  const { scope, value } = reward.scopeId;
  const discount = scope === "Fixed Amount" ? value : (value / 100) * total;

  return Math.min(Math.max(discount, 0), total);
}

/** A Free Delivery reward waives the delivery charge entirely. */
export function getFreeDeliveryDiscount(reward: RewardHistory | null, deliveryFee: number): number {
  return reward ? Math.max(deliveryFee, 0) : 0;
}

/** A Promo Code reward grants its numeric discount, capped at the total. */
export function getPromoDiscount(reward: RewardHistory | null, total: number): number {
  if (!reward) return 0;
  return Math.min(Math.max(reward.discountSpinDiscount ?? 0, 0), total);
}

/**
 * Discount a dashboard-selected reward (a RewardHistory) grants, dispatched by
 * its reward type:
 * - freeDelivery: waives the delivery fee.
 * - discountSpin / promoCode: the reward's numeric `discountSpinDiscount`.
 */
export function getRewardHistoryDiscount(
  reward: RewardHistory,
  { deliveryFee, total }: { deliveryFee: number; total: number },
): number {
  const type = reward.rewardType ?? reward.source;
  if (type === "freeDelivery") return Math.min(Math.max(deliveryFee, 0), total);
  return Math.min(Math.max(reward.discountSpinDiscount ?? 0, 0), total);
}

export interface GamifiedItem {
  rewardId: string;
  rewardType: GamificationRewardType;
}

/**
 * Builds the order's `gamified` payload from every reward the user opted into —
 * cart toggles (session storage) and dashboard selections — deduped by reward
 * type, with dashboard selections overriding cart toggles of the same type.
 */
export function buildGamifiedPayload({
  rewardsToUse,
  selectedRewards,
  spinRewardId,
  freeDeliveryReward,
  promoReward,
}: {
  rewardsToUse: Record<GamificationRewardType, boolean>;
  selectedRewards: RewardHistory[];
  /** Spin reward id comes from the eligibility payload, not session storage. */
  spinRewardId?: string;
  freeDeliveryReward: RewardHistory | null;
  promoReward: RewardHistory | null;
}): GamifiedItem[] {
  const byType = new Map<GamificationRewardType, GamifiedItem>();

  // 1) Cart toggles.
  if (rewardsToUse.discountSpin && spinRewardId)
    byType.set("discountSpin", { rewardId: spinRewardId, rewardType: "discountSpin" });
  if (rewardsToUse.freeDelivery && freeDeliveryReward)
    byType.set("freeDelivery", { rewardId: freeDeliveryReward._id, rewardType: "freeDelivery" });
  if (rewardsToUse.promoCode && promoReward)
    byType.set("promoCode", { rewardId: promoReward._id, rewardType: "promoCode" });

  // 2) Dashboard selections (override cart toggles of the same type).
  for (const reward of selectedRewards) {
    const rewardType = reward.rewardType ?? reward.source;
    byType.set(rewardType, { rewardId: reward._id, rewardType });
  }

  return Array.from(byType.values());
}
