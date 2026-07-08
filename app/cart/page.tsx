"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, Home, Loader2, Search } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { cartService } from "@/lib/services/cart.service";
import type { ApplicableFees, CartItem } from "@/types/cart";
import { toCartItem } from "@/types/cart";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-utils";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useCheckFirstOrder, useGetAllFees, useGetCartItems } from "@/lib/queries";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import SubHeader from "@/components/sub-header";
import useUserLocation from "@/hooks/useUserLocation";
import { useUserStore } from "@/store/useUserStore";
import CartTotal from "./cart-totals/CartTotal";
import ShoppingCart from "./shopping-cart/ShoppingCart";

const DEBOUNCE_MS = 500;

export default function CartPage() {
  const { user, userEligibles, adminGamifiedEnabled } = useUserStore();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const router = useRouter();
  const token = getAuthToken();
  const { toast } = useToast();
  const {
    data: cartItemsResponse,
    isLoading: cartItemsLoading,
    error: cartItemsError,
    refetch: refetchCartItems,
  } = useGetCartItems();
  const { data: allFeesResponse, isLoading: allFeesLoading } = useGetAllFees();
  const { data: firstOrder, isLoading: firstOrderLoading } = useCheckFirstOrder({
    userId: user?._id ?? "",
  });
  const { customerState } = useUserLocation({ isDetectAddress: true });
  const queryClient = useQueryClient();

  // Per-item accumulated quantity deltas, debounced so rapid +/- clicks
  // collapse into a single request instead of hammering the endpoint.
  const pendingDeltas = useRef<
    Map<string, { delta: number; timer: ReturnType<typeof setTimeout> }>
  >(new Map());

  const locationFee = useMemo(() => {
    return allFeesResponse?.allfees?.find((fee) => {
      return customerState.toLowerCase().includes(fee.stateLocation.toLowerCase());
    });
  }, [allFeesResponse, customerState]);

  const applicableFee = useMemo(() => {
    if (!locationFee) return {} as ApplicableFees;

    if (!locationFee.isFreeDeliveryOnFirstOrder) return locationFee;

    if (firstOrder && !firstOrder.hasOrderedBefore) return { ...locationFee, deliveryFee: 0 };

    return locationFee;
  }, [firstOrder, locationFee]);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = applicableFee?.deliveryFee || 4000;
  const serviceCharge = applicableFee?.serviceFee || 500; // default service charge;
  const total = subtotal + deliveryCharge + serviceCharge;

  const isEmpty = cartItems.length === 0;

  const { mutate: updateCartItemMutate } = useMutation({
    mutationFn: cartService.updateCartItem,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getCart] });
    },
    onError: () => {
      const items = (cartItemsResponse?.data ?? []).map(toCartItem);
      setCartItems(items);
      toast({ variant: "error", title: "Failed to update item. Please try again." });
    },
  });

  const flushDelta = (id: string) => {
    const entry = pendingDeltas.current.get(id);
    if (!entry) return;
    pendingDeltas.current.delete(id);
    if (entry.delta === 0) return;
    updateCartItemMutate({ productId: id, quantity: entry.delta });
  };

  const updateQuantity = (id: string, delta: number) => {
    const current = cartItems.find((item) => item.productId === id);
    if (!current) return;

    const newQty = Math.max(1, current.quantity + delta);
    const effectiveDelta = newQty - current.quantity;
    if (effectiveDelta === 0) return;

    setCartItems((prev) =>
      prev.map((item) => (item.productId === id ? { ...item, quantity: newQty } : item)),
    );

    const existing = pendingDeltas.current.get(id);
    if (existing) clearTimeout(existing.timer);

    const accumulated = (existing?.delta ?? 0) + effectiveDelta;
    const timer = setTimeout(() => flushDelta(id), DEBOUNCE_MS);
    pendingDeltas.current.set(id, { delta: accumulated, timer });
  };

  const removeItem = async (id: string) => {
    // Optimistic removal — instantly update the UI
    const previousItems = [...cartItems];
    setCartItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await cartService.deleteCartItem({ itemId: id });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getCart] });
    } catch {
      // Roll back on failure and notify the user
      setCartItems(previousItems);
      toast({ variant: "error", title: "Failed to remove item. Please try again." });
    }
  };

  useEffect(() => {
    if (!cartItemsResponse) return;

    const items = (cartItemsResponse.data ?? []).map(toCartItem);

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCartItems(items);
  }, [cartItemsResponse]);

  // Flush any pending quantity changes on unmount so nothing is lost when the
  // user navigates away before the debounce timer fires.
  useEffect(() => {
    const pending = pendingDeltas.current;
    return () => {
      pending.forEach((entry, id) => {
        clearTimeout(entry.timer);
        if (entry.delta !== 0) {
          cartService.updateCartItem({ productId: id, quantity: entry.delta }).catch(() => {});
        }
      });
      pending.clear();
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* ---------- Header ---------- */}
      <TopRibbon />
      <Header />
      <SubHeader
        currentLocationData={<span className="text-[#8cc629]">Cart ({cartItems.length})</span>}
      />

      {/* ---------- Loading State ---------- */}
      {!token ? (
        <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-md px-8 py-10 max-w-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-10 text-blue-400 mx-auto mb-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4" />
              <path d="M12 16h.01" />
            </svg>
            <h2 className="text-lg font-bold text-gray-800 mb-2">Login to access your cart</h2>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-400 text-white px-6 py-2.5 rounded-md font-bold text-sm transition-colors uppercase tracking-wide"
            >
              Login
            </button>
          </div>
        </section>
      ) : cartItemsLoading ? (
        <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="size-10 text-[#8cc629] animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading your cart…</p>
        </section>
      ) : cartItemsError ? (
        <ErrorSection message={handleError(cartItemsError)} onRetry={refetchCartItems} />
      ) : isEmpty ? (
        <>
          <div className="w-full bg-white border-b border-gray-100 py-3 md:hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="relative w-full flex items-center">
                <Search className="absolute left-3 text-gray-400 size-4" />
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="w-full pl-10 pr-4 py-2.5 border border-[#8cc629] rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-[#8cc629]"
                />
              </div>
            </div>
          </div>

          <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-16 md:py-24 flex flex-col items-center justify-center text-center">
            {/* Empty Cart Graphic */}
            <div className="relative size-75 md:w-100 md:h-100 mb-8">
              <Image
                src="/assets/cart-empty-state.png"
                alt="Empty Shopping Cart"
                fill
                className="object-contain"
              />
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 tracking-tight">
              Nothing here yet!
            </h1>

            <p className="text-gray-500 text-[15px] max-w-md mx-auto leading-relaxed mb-10">
              Item Craving something fresh? Add seafood or fruits
              <br className="hidden md:block" />
              to get started. Successfully!
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <button
                className="flex items-center justify-center gap-2 bg-[#8cc629] text-white px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide hover:bg-[#7db424] transition-colors w-full sm:w-auto"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="size-4" />
                GO BACK
              </button>

              <Link
                href="/"
                className="flex items-center justify-center gap-2 bg-white text-[#8cc629] border border-[#8cc629] px-8 py-3.5 rounded-sm font-bold text-sm tracking-wide hover:bg-[#f4faee] transition-colors w-full sm:w-auto"
              >
                <Home className="size-4" />
                GO TO HOME
              </Link>
            </div>
          </div>
        </>
      ) : (
        <section className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[#8cc629] border border-[#d3e9b1] bg-[#f9fdf4] px-6 py-2 rounded-md font-medium text-sm hover:bg-[#f4faee] transition-colors"
            >
              <ArrowLeft className="size-4" />
              Continue Shopping
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <ShoppingCart
              cartItems={cartItems}
              onRemoveItem={removeItem}
              onUpdateQuantity={updateQuantity}
              onReturnToStore={() => router.push("products?page=0")}
            />

            <CartTotal
              isLoading={firstOrderLoading || allFeesLoading}
              subtotal={subtotal}
              deliveryCharge={deliveryCharge}
              serviceCharge={serviceCharge}
              total={total}
              accountType={user?.accountType}
              canUsePromoCode={
                user?.accountType === "outright" &&
                !!userEligibles?.promoCode?.eligible &&
                !!adminGamifiedEnabled?.promoCode?.enabled
              }
              onProceedToCheckout={() => router.push("/checkout")}
            />
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
