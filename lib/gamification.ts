import { getFromStorage } from "./auth-utils";
import type { SpinFunction } from "@/types/user";

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
