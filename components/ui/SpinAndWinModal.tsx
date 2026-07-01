"use client";

import { useGetSpinItems } from "@/lib/queries";
import { setToStorage } from "@/lib/auth-utils";
import { useMutation } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";
import { handleError } from "@/lib/handle-error";
import { ClaimGamificationPayload, SpinFunction } from "@/types/user";
import { useToast } from "./toast/ToastProvider";
import SpinWheelModal, { WheelItem } from "./SpinWheelModal";

interface SpinAndWinModalProps {
  open: boolean;
  /** Dismiss without claiming (e.g. the ✕ button). */
  onClose: () => void;
  /** Claim the reward — advances to the next eligible modal. */
  onClaim: () => void;
}

const formatPrize = (scope: string, value: number) =>
  scope === "Fixed Amount" ? `₦${value.toLocaleString()} Off` : `${value}% Off`;

export default function SpinAndWinModal({ open, onClose, onClaim }: SpinAndWinModalProps) {
  const { toast } = useToast();
  const { data: spinItems, isLoading: spinItemsLoading } = useGetSpinItems();

  const { isPending: isClaiming, mutate: claimMutation } = useMutation({
    mutationFn: userService.claimGamification,
    onError: (error) => {
      toast({ variant: "error", title: handleError(error) });
    },
  });

  // One wheel segment per spin function, normalized for the shared wheel.
  const items: WheelItem<SpinFunction>[] = (spinItems?.functions ?? []).map((fn) => ({
    id: fn.scopeId._id,
    image: fn.scopeId.image,
    label: formatPrize(fn.scopeId.scope, fn.scopeId.value),
    isActive: fn.scopeId.isActive,
    raw: fn,
  }));

  const handleClaim = (wonItem: WheelItem<SpinFunction>) => {
    const scope = wonItem.raw.scopeId;
    const isDiscount = scope.scope.toLowerCase().includes("discount");

    const payload: ClaimGamificationPayload = {
      orderId: scope._id,
      reward: scope.scope,
      rewardType: "discountSpin",
      expiresAt: "",
      status: scope.isActive ? "active" : "",
      discountSpinBonus: scope.scope === "Fixed Amount" ? scope.value : undefined,
      discountSpinDiscount: isDiscount ? scope.value : undefined,
    };

    claimMutation(payload, {
      onSuccess: () => {
        // Persist the won prize so it can be applied later.
        setToStorage("SPINNED_ITEM", JSON.stringify(wonItem.raw));
        onClaim();
      },
    });
  };

  return (
    <SpinWheelModal
      open={open}
      items={items}
      isLoading={spinItemsLoading}
      isClaiming={isClaiming}
      onClose={onClose}
      onClaim={handleClaim}
      description="As a thank you for your purchase, spin the wheel for a chance to win a gift on your last order."
      idleFooter="Every purchase above ₦30,000 gives you a spin. Reward selected will be added to your item."
      wonFooter="Thank you for shopping with us! Your gift will be added to your current order over ₦30,000."
    />
  );
}
