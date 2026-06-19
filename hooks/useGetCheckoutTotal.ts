"use client";

import { useMemo } from "react";
import { useGetAllFees, useGetCartItems, useCheckFirstOrder } from "@/lib/queries";
import { toCartItem, type ApplicableFees } from "@/types/cart";
import { useUserStore } from "@/store/useUserStore";
import { useRewardStore } from "@/store/useRewardStore";
import useUserLocation from "@/hooks/useUserLocation";
import { getSpinDiscount, getSpinnedReward } from "@/lib/gamification";

/**
 * Derives the checkout totals from the authoritative server data (cart items,
 * fee table, first-order eligibility) rather than reading them from the URL.
 *
 * NOTE: these figures are still computed in the browser, so they are only as
 * trustworthy as the backend's own validation. The server must remain the
 * source of truth for what a user is actually charged.
 */
const useGetCheckoutTotal = () => {
  const { user, isSpinDiscountApplied } = useUserStore();
  const appliedReward = useRewardStore((state) => state.appliedReward);
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

  // A reward chosen from Reward History takes precedence; otherwise fall back to
  // a freshly spun reward the user toggled on in the cart.
  const rewardDiscount =
    appliedReward?.source === "discountSpin" ? (appliedReward.discountSpinDiscount ?? 0) : 0;
  const spinReward = isSpinDiscountApplied ? getSpinnedReward() : null;
  const spinToggleDiscount = getSpinDiscount(spinReward, grossTotal);

  const spinDiscount = Math.min(Math.max(rewardDiscount || spinToggleDiscount, 0), grossTotal);

  const amountPay = grossTotal - spinDiscount;

  const isLoading = cartLoading || feesLoading || firstOrderLoading;

  return {
    subtotal,
    deliveryFee,
    serviceFee,
    spinDiscount,
    grossTotal,
    amountPay,
    isLoading,
  };
};

export default useGetCheckoutTotal;
