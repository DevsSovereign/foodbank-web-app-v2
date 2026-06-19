"use client";

import { useMemo } from "react";
import { useGetAllFees, useGetCartItems, useCheckFirstOrder } from "@/lib/queries";
import { toCartItem, type ApplicableFees } from "@/types/cart";
import { useUserStore } from "@/store/useUserStore";
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

  // Spin & Win discount, only when the user has toggled it on.
  const spinReward = isSpinDiscountApplied ? getSpinnedReward() : null;
  const spinDiscount = getSpinDiscount(spinReward, grossTotal);

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
