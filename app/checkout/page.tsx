"use client";

import Link from "next/link";
import { useState, useMemo, Suspense } from "react";
import { Home, Loader2 } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import EditCustomerModal from "../../components/checkout/EditCustomerModal";
import AddPhoneNumberModal from "../../components/checkout/AddPhoneNumberModal";
import DatePickerModal from "../../components/checkout/DatePickerModal";
import UserCheckoutDetails from "./user-checkout-details/UserCheckoutDetails";
import CheckoutPaymentDetails from "./checkout-payment-details/CheckoutPaymentDetails";
import { useUserStore } from "@/store/useUserStore";
import useUserLocation from "@/hooks/useUserLocation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cartService } from "@/lib/services/cart.service";
import { handleError } from "@/lib/handle-error";
import { CreateOrderPayload } from "@/types/cart";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useGetCustomer, useGetUserCheckoutGamification } from "@/lib/queries";
import { useRouter } from "next/navigation";
import useGetCheckoutTotal from "@/hooks/useGetCheckoutTotal";
import { removeFromStorage } from "@/lib/auth-utils";
import { useRewardStore } from "@/store/useRewardStore";
import { userService } from "@/lib/services/user.service";
import { buildGamifiedPayload, getFreeDeliveryReward, getPromoReward } from "@/lib/gamification";
import CheckoutSpinModal from "@/components/ui/CheckoutSpinModal";
import type { WheelItem } from "@/components/ui/SpinWheelModal";
import type { CheckoutCategoryItems } from "@/types/user";

function CheckoutPageContent() {
  const { user, setUser, userEligibles, adminGamifiedEnabled, rewardsToUse } = useUserStore();
  const { selectedRewards, clearSelectedRewards } = useRewardStore();
  const [isCreatingOrder, setIsCreatingOrder] = useState<boolean>(false);
  const [isCheckoutSpinOpen, setIsCheckoutSpinOpen] = useState<boolean>(false);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [paymentOption, setPaymentOption] = useState<"wallet" | "online">("wallet");
  const [isEditCustomerModalOpen, setIsEditCustomerModalOpen] = useState<boolean>(false);
  const [isAddPhoneModalOpen, setIsAddPhoneModalOpen] = useState<boolean>(false);
  const [customerPhone, setCustomerPhone] = useState<string>(user?.phoneNumber ?? "");
  const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
  const [selectedDeliveryDate, setSelectedDeliveryDate] = useState<Date>(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow;
  });
  const { customerAddress, setCustomerAddress } = useUserLocation({ isDetectAddress: true });
  const { payableDeliveryFee, serviceFee, amountPay } = useGetCheckoutTotal();
  const { toast } = useToast();
  const { refetch: refetchUser } = useGetCustomer();
  const { data: checkoutGamification } = useGetUserCheckoutGamification({ amountToPay: amountPay });
  const router = useRouter();
  const queryClient = useQueryClient();

  // Checkout Spin & Win eligibility — mirrors the home page's gamification gate.
  const checkoutCategoryEligible =
    !!adminGamifiedEnabled?.checkoutCategory?.enabled &&
    !!userEligibles?.checkoutCategory?.eligible &&
    !!userEligibles?.checkoutCategory?.showToUser;

  // The single tier the user qualifies for: the highest purchaseRange that the
  // amount payable still meets (amountPay >= purchaseRange).
  const winningCategory = useMemo(() => {
    const qualifying = (checkoutGamification ?? []).filter(
      (category) => amountPay >= category.purchaseRange,
    );
    if (qualifying.length === 0) return null;
    return qualifying.reduce((top, category) =>
      category.purchaseRange > top.purchaseRange ? category : top,
    );
  }, [checkoutGamification, amountPay]);

  // That tier's items become the wheel segments.
  const checkoutSpinItems: WheelItem<CheckoutCategoryItems>[] = (winningCategory?.items ?? []).map(
    (item) => ({
      id: item._id,
      image: item.imageUrl,
      label: item.tag,
      isActive: item.isActive,
      raw: item,
    }),
  );

  const canShowCheckoutSpin = checkoutCategoryEligible && checkoutSpinItems.length > 0;

  // Deferred tail of a successful order: only run once the prize is claimed (or
  // the spin modal is dismissed), since the order itself is already placed.
  const finalizeCheckout = async () => {
    setIsCheckoutSpinOpen(false);
    await queryClient.invalidateQueries({ queryKey: [queryKeys.rewardHistory] });
    router.replace("/dashboard/order-history");
  };

  const { isPending: orderIsCreating, mutate } = useMutation({
    mutationFn: cartService.createOrder,

    onSuccess: async () => {
      await cartService.outrightSubtractFromWalletById({ amountPay });
      const { data: userProfile } = await refetchUser();
      if (!userProfile) return;

      setUser(userProfile.customer);
      toast({ variant: "success", title: "Order Created Successfully" });
      // Consume the applied rewards so they can only be used once.
      removeFromStorage("SPINNED_ITEM");
      removeFromStorage("FREE_DELIVERY");
      removeFromStorage("PROMO_CODE");
      clearSelectedRewards();

      if (canShowCheckoutSpin) {
        setIsCheckoutSpinOpen(true);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: [queryKeys.rewardHistory] });
      router.replace("/dashboard/order-history");
    },

    onError: (error) => {
      const errMsg = handleError(error);
      toast({ variant: "error", title: errMsg });
    },
  });

  const handleCheckout = async () => {
    if (amountPay === 0) return;

    /** This is to effectively display a loading state for the use
     * gamification promise */
    setIsCreatingOrder(true);

    /** Combine every opted-in reward — cart toggles (session storage) and
     dashboard selections — into one unduplicated gamified payload.*/
    const gamified: CreateOrderPayload["gamified"] = buildGamifiedPayload({
      rewardsToUse,
      selectedRewards,
      spinRewardId: userEligibles?.discountSpin?.reward?.rewardId,
      freeDeliveryReward: getFreeDeliveryReward(),
      promoReward: getPromoReward(),
    });

    const createOrderPayload: CreateOrderPayload = {
      deliveryDetails: customerAddress,
      deliveryFee: payableDeliveryFee,
      serviceFee,
      deliveryContact: customerPhone || (user?.phoneNumber as string),
      deliveryDateOption: selectedDeliveryDate.toISOString(),
      orderType: "outright",
      topUpAmount: 0,
      gamified,
    };

    try {
      // Tell the backend about every reward being used, not just the first.
      if (gamified.length > 0) {
        await Promise.all(
          gamified.map((reward) =>
            userService.useClaimedGamification({
              kind: reward.rewardType,
              orderId: reward.rewardId,
            }),
          ),
        );
      }

      return mutate(createOrderPayload);
    } catch (error) {
      toast({ variant: "error", title: handleError(error) });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fdfdfc]">
      <TopRibbon />
      <Header />

      <nav className="bg-white border-b border-gray-100 py-3 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-sm font-medium flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-[#6cc200] transition"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-800">Checkout</span>
          </div>

          <button
            className="md:hidden text-gray-600 p-1"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {mobileNavOpen ? (
                <path d="M18 6 6 18M6 6l12 12" />
              ) : (
                <path d="M4 12v0M4 6v0M4 18v0M8 12h12M8 6h12M8 18h12" />
              )}
            </svg>
          </button>

          <div className="hidden md:flex items-center gap-6">
            {/* <Link
              href="/categories"
              className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition"
            >
              <span className="text-gray-800">All Category</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </Link> */}

            <Link
              href="/dashboard/track-delivery"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Track Order
            </Link>

            <Link
              href="/dashboard/support"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              Customer Support
            </Link>

            <Link
              href="/dashboard/help-center"
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#6cc200] transition font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Help Center
            </Link>
          </div>
        </div>

        {mobileNavOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 absolute top-full left-0 right-0 shadow-sm px-4 py-3 pb-4 space-y-4">
            <Link
              href="/categories"
              className="flex items-center justify-between text-sm text-gray-600 hover:text-[#6cc200] transition"
            >
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                All Category
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
            <Link
              href="/dashboard/track-delivery"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              Track Order
            </Link>
            <Link
              href="/dashboard/support"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 18v-6a9 9 0 0 1 18 0v6" />
                <path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z" />
              </svg>
              Customer Support
            </Link>
            <Link
              href="/dashboard/help-center"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-[#6cc200] transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 16v-4" />
                <path d="M12 8h.01" />
              </svg>
              Help Center
            </Link>
          </div>
        )}
      </nav>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 space-y-8">
        <UserCheckoutDetails
          user={user}
          customerAddress={customerAddress}
          customerPhone={customerPhone}
          selectedDeliveryDate={selectedDeliveryDate}
          onEditCustomer={() => setIsEditCustomerModalOpen(true)}
          onEditPhone={() => setIsAddPhoneModalOpen(true)}
          onPickDate={() => setIsDatePickerOpen(true)}
        />

        <CheckoutPaymentDetails
          accountType={user?.accountType}
          walletBalance={user?.virtualAccount?.walletbalance ?? 0}
          paymentOption={paymentOption}
          onPaymentOptionChange={setPaymentOption}
          orderIsCreating={orderIsCreating || isCreatingOrder}
          isConfirmDisabled={
            amountPay === 0 ||
            orderIsCreating ||
            isCreatingOrder ||
            !customerAddress ||
            //  customerAddress.toLowerCase() === "detecting your current location…" ||
            (!user?.phoneNumber && !customerPhone)
          }
          onConfirmCheckout={handleCheckout}
        />
      </main>

      <Footer />

      {/* modals */}
      <EditCustomerModal
        isOpen={isEditCustomerModalOpen}
        onClose={() => setIsEditCustomerModalOpen(false)}
        onSave={(details) => {
          const { houseNumber, landmark, stateLocation } = details;
          const addressParts = [houseNumber, landmark, stateLocation].filter(Boolean);
          if (addressParts.length > 0) {
            setCustomerAddress(addressParts.join(", "));
          }
        }}
      />

      <AddPhoneNumberModal
        isOpen={isAddPhoneModalOpen}
        onClose={() => setIsAddPhoneModalOpen(false)}
        onSave={(phone) => setCustomerPhone(phone)}
      />

      <DatePickerModal
        isOpen={isDatePickerOpen}
        onClose={() => setIsDatePickerOpen(false)}
        onSelectDate={setSelectedDeliveryDate}
        selectedDate={selectedDeliveryDate}
      />

      {/* Post-order Spin & Win — claiming (or dismissing) finalizes the checkout. */}
      <CheckoutSpinModal
        open={isCheckoutSpinOpen}
        items={checkoutSpinItems}
        onClose={finalizeCheckout}
        onClaimed={finalizeCheckout}
      />
    </div>
  );
}

// returned page
export default function CheckoutPage() {
  return (
    <Suspense fallback={<Loader2 className="size-5 animate-spin" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
