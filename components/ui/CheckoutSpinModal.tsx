"use client";

import { useMutation } from "@tanstack/react-query";
import { userService } from "@/lib/services/user.service";
import { handleError } from "@/lib/handle-error";
import { ClaimGamificationPayload, CheckoutCategoryItems } from "@/types/user";
import { useToast } from "./toast/ToastProvider";
import SpinWheelModal, { WheelItem } from "./SpinWheelModal";

interface CheckoutSpinModalProps {
  open: boolean;
  items: WheelItem<CheckoutCategoryItems>[];
  onClose: () => void;
  onClaimed: () => void;
}

export default function CheckoutSpinModal({
  open,
  items,
  onClose,
  onClaimed,
}: CheckoutSpinModalProps) {
  const { toast } = useToast();

  const { isPending: isClaiming, mutate: claimMutation } = useMutation({
    mutationFn: userService.claimGamification,
    onError: (error) => {
      toast({ variant: "error", title: handleError(error) });
    },
  });

  const handleClaim = (wonItem: WheelItem<CheckoutCategoryItems>) => {
    const payload: ClaimGamificationPayload = {
      orderId: wonItem.id,
      reward: wonItem.label,
      rewardType: "checkoutCategory",
      status: wonItem.isActive ? "active" : "",
      checkoutCategory: {
        type: wonItem.label,
        gift: wonItem.label,
      },
    };

    claimMutation(payload, { onSuccess: onClaimed });
  };

  return (
    <SpinWheelModal
      open={open}
      items={items}
      isClaiming={isClaiming}
      onClose={onClose}
      onClaim={handleClaim}
      subtitle="You've unlocked a Spin & Win!"
      description="Thanks for your order! Spin the wheel to reveal a gift on this purchase."
      idleFooter="Spin the wheel and press Stop whenever you're ready to reveal your reward."
      wonFooter="Thank you for shopping with us! Your gift will be added to your order."
    />
  );
}
