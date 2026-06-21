"use client";

import { useMemo } from "react";
import { useGetAllFees, useGetCartItems, useCheckFirstOrder } from "@/lib/queries";
import { toCartItem, type ApplicableFees } from "@/types/cart";
import { useUserStore } from "@/store/useUserStore";
import { useRewardStore } from "@/store/useRewardStore";
import useUserLocation from "@/hooks/useUserLocation";
import {
  getSpinDiscount,
  getSpinnedReward,
  getFreeDeliveryDiscount,
  getFreeDeliveryReward,
  getPromoDiscount,
  getPromoReward,
  getRewardHistoryDiscount,
  REWARD_DISCOUNT_LABELS,
} from "@/lib/gamification";
import type { AppliedDiscount, GamificationRewardType } from "@/types/user";

const useGetCheckoutTotal = () => {
  const { user, rewardsToUse } = useUserStore();
  const selectedRewards = useRewardStore((state) => state.selectedRewards);
  const { data: cartItemsResponse, isLoading: cartLoading } = useGetCartItems();
  const { data: allFeesResponse, isLoading: feesLoading } = useGetAllFees();
  const { data: firstOrder, isLoading: firstOrderLoading } = useCheckFirstOrder({
    userId: user?._id ?? "",
  });
  const { customerState } = useUserLocation({ isDetectAddress: true });

  const locationFee = useMemo(() => {
    return allFeesResponse?.allfees?.find((fee) =>
      customerState.toLowerCase().includes(fee.stateLocation.toLowerCase()),
    );
  }, [allFeesResponse, customerState]);

  const applicableFee = useMemo<ApplicableFees | undefined>(() => {
    if (!locationFee) return undefined;
    if (!locationFee.isFreeDeliveryOnFirstOrder) return locationFee;
    if (firstOrder && !firstOrder.hasOrderedBefore) return { ...locationFee, deliveryFee: 0 };
    return locationFee;
  }, [firstOrder, locationFee]);

  const subtotal = useMemo(() => {
    const items = (cartItemsResponse?.data ?? []).map(toCartItem);
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [cartItemsResponse]);

  // Mirror the cart's fallbacks exactly so both screens show identical totals.
  const deliveryFee = applicableFee?.deliveryFee || 4000;
  const serviceFee = applicableFee?.serviceFee || 500;
  const grossTotal = subtotal + deliveryFee + serviceFee;

  /** Collect every applied discount, deduped by reward type. Cart toggles are
  added first; a dashboard selection of the same type then overrides it. */
  const appliedDiscounts = useMemo<AppliedDiscount[]>(() => {
    const byType = new Map<GamificationRewardType, AppliedDiscount>();

    const addDiscount = (type: GamificationRewardType, amount: number) => {
      if (amount > 0) {
        byType.set(type, { type, label: REWARD_DISCOUNT_LABELS[type], amount });
      }
    };

    // 1) Rewards toggled on in the cart (read from session storage).
    if (rewardsToUse.discountSpin) {
      addDiscount("discountSpin", getSpinDiscount(getSpinnedReward(), grossTotal));
    }
    if (rewardsToUse.freeDelivery) {
      addDiscount("freeDelivery", getFreeDeliveryDiscount(getFreeDeliveryReward(), deliveryFee));
    }
    if (rewardsToUse.promoCode) {
      addDiscount("promoCode", getPromoDiscount(getPromoReward(), grossTotal));
    }

    // 2) Rewards selected from the dashboard (override cart toggles by type).
    for (const reward of selectedRewards) {
      const type = reward.rewardType ?? reward.source;
      addDiscount(type, getRewardHistoryDiscount(reward, { deliveryFee, total: grossTotal }));
    }

    return Array.from(byType.values());
  }, [rewardsToUse, selectedRewards, grossTotal, deliveryFee]);

  /** Combined discount, capped so the payable amount never goes negative. */
  const totalDiscount = Math.min(
    appliedDiscounts.reduce((acc, discount) => acc + discount.amount, 0),
    grossTotal,
  );

  /**Total amount to pay*/
  const amountPay = grossTotal - totalDiscount;

  /** What the backend should record as the delivery fee: 0 when a free-delivery */
  const isFreeDeliveryApplied = appliedDiscounts.some((d) => d.type === "freeDelivery");

  /** reward is applied (toggled or dashboard-selected), otherwise the real fee.*/
  const payableDeliveryFee = isFreeDeliveryApplied ? 0 : deliveryFee;

  /**sum Items loading state*/
  const isLoading = cartLoading || feesLoading || firstOrderLoading;

  return {
    subtotal,
    deliveryFee,
    payableDeliveryFee,
    serviceFee,
    appliedDiscounts,
    totalDiscount,
    grossTotal,
    amountPay,
    isLoading,
  };
};

export default useGetCheckoutTotal;
