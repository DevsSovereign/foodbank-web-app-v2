/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Home, Loader2, Search } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryDropdown from "@/components/layout/CategoryDropdown";
import { cartService } from "@/lib/services/cart.service";
import type { CartItem } from "@/types/cart";
import { toCartItem } from "@/types/cart";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-utils";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useGetCartItems } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [mobileNavOpen, setMobileNavOpen] = useState<boolean>(false);
  const [isInstructionAgreed, setIsInstructionAgreed] = useState<boolean>(false);
  const router = useRouter();
  const token = getAuthToken();
  const { toast } = useToast();
  const {
    data: cartItemsResponse,
    isLoading: cartItemsLoading,
    error: cartItemsError,
    refetch: refetchCartItems,
  } = useGetCartItems();
  const queryClient = useQueryClient();

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryCharge = 0;
  const serviceCharge = 500;
  const total = subtotal + deliveryCharge + serviceCharge;

  const isEmpty = cartItems.length === 0;

  const updateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item,
      ),
    );
  };

  const removeItem = async (id: string) => {
    // Optimistic removal — instantly update the UI
    const previousItems = cartItems;
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

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopRibbon />
      <Header />

      <nav className="bg-[#f4faee] border-b border-gray-100 py-3 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="text-sm font-medium flex items-center gap-2 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 text-gray-500 hover:text-[#6cc200] transition"
            >
              <Home className="size-4" />
              <span>Home</span>
            </Link>
            <span className="text-gray-400">&gt;</span>
            <span className="text-gray-800">
              Cart <span className="text-[#8cc629]">({cartItems.length})</span>
            </span>
          </div>

          <button
            className="md:hidden text-gray-600 p-1"
            onClick={() => setMobileNavOpen((prev) => !prev)}
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
            <CategoryDropdown triggerStyle="pageNav" />

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
            <CategoryDropdown triggerStyle="pageNav" />

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
            <div className="flex-1 w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Shopping Cart</h2>

              <div className="bg-white border border-gray-100 rounded-sm overflow-hidden mb-8 shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-xs font-bold text-gray-600 uppercase tracking-wider border-b border-gray-100">
                        <th className="px-6 py-4">Products</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Quantity</th>
                        <th className="px-6 py-4">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {cartItems.map((item) => (
                        <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-6">
                            <div className="flex items-center gap-4">
                              <button
                                title={`Remove ${item.name}`}
                                onClick={() => removeItem(item.id)}
                                className="text-gray-300 hover:text-red-500 transition-colors"
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
                                  <circle cx="12" cy="12" r="10" />
                                  <path d="m15 9-6 6" />
                                  <path d="m9 9 6 6" />
                                </svg>
                              </button>
                              <div className="relative size-20 bg-gray-50 rounded-sm shrink-0">
                                {item.image?.startsWith("http") ? (
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    width={50}
                                    height={50}
                                    className="absolute inset-0 size-full object-contain p-2"
                                    loading="lazy"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLImageElement).src =
                                        "/assets/foodbank-logo-4-1.png";
                                    }}
                                  />
                                ) : (
                                  <Image
                                    src={item.image || "/assets/foodbank-logo-4-1.png"}
                                    alt={item.name}
                                    fill
                                    className="object-contain p-2"
                                  />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-gray-800 mb-1">
                                  {item.name}
                                </p>
                                <span className="text-[10px] bg-[#fff0e5] text-[#ff8a00] px-2 py-0.5 rounded-full font-bold uppercase">
                                  {item.tag}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm font-medium text-gray-800">
                            ₦{item.price.toLocaleString()}
                          </td>
                          <td className="px-6 py-6">
                            <div className="flex items-center border border-gray-200 rounded-md w-fit">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                              >
                                —
                              </button>
                              <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-200 min-w-10 text-center">
                                {item.quantity.toString().padStart(2, "0")}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-sm font-bold text-gray-800">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="px-6 py-4 bg-white flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                  <button
                    onClick={() => router.push("products?page=0")}
                    className="text-[13px] font-bold text-[#8cc629] border border-[#8cc629] px-6 py-2.5 rounded-md hover:bg-[#f4faee] transition-colors w-full sm:w-auto uppercase tracking-wide"
                  >
                    Return to store
                  </button>
                  <button className="text-[13px] font-bold text-[#8cc629] border border-[#8cc629] px-6 py-2.5 rounded-md hover:bg-[#f4faee] transition-colors w-full sm:w-auto uppercase tracking-wide">
                    Update Cart
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-95 space-y-6">
              <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">Cart Totals</h3>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Sub total</span>
                    <span className="font-bold text-gray-800">₦{subtotal.toLocaleString()}.00</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Delivery Charge</span>
                    <span className="font-bold text-gray-800">
                      ₦{deliveryCharge.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Service Charge</span>
                    <span className="font-bold text-gray-800">
                      ₦{serviceCharge.toLocaleString()}.00
                    </span>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="text-xl font-bold text-gray-800">
                      ₦{total.toLocaleString()}.00
                    </span>
                  </div>

                  <div className="flex items-start gap-2 mt-6">
                    <input
                      checked={isInstructionAgreed}
                      onChange={(e) => setIsInstructionAgreed(e.target.checked)}
                      type="checkbox"
                      id="terms"
                      className="mt-1 accent-[#8cc629]"
                    />
                    <label htmlFor="terms" className="text-[12px] text-gray-500 leading-normal">
                      I have read the instruction above and I agree to{" "}
                      <Link href="/terms" className="text-gray-800 font-medium hover:underline">
                        FoodBank&apos;s Refund & Return Policy
                      </Link>
                    </label>
                  </div>

                  <button
                    onClick={() =>
                      router.push(
                        `/checkout?sub=${subtotal}&del=${deliveryCharge}&svc=${serviceCharge}`,
                      )
                    }
                    disabled={!isInstructionAgreed}
                    className="w-full bg-[#8cc629] disabled:opacity-60 text-white py-4 rounded-md font-bold text-sm flex items-center justify-center gap-2 hover:bg-[#7db424] transition-colors mt-4 tracking-wide uppercase"
                  >
                    Proceed to Checkout
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="bg-white border border-gray-100 rounded-sm shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100">
                  <h3 className="text-lg font-bold text-gray-800">Coupon Code</h3>
                </div>
                <div className="p-6">
                  <input
                    type="text"
                    placeholder="enter your coupon code"
                    className="w-full px-4 py-3 border border-gray-200 rounded-md text-sm mb-4 focus:outline-none focus:border-[#8cc629]"
                  />
                  <button className="w-full bg-[#8cc629] text-white py-3 rounded-md font-bold text-sm hover:bg-[#7db424] transition-colors tracking-wide uppercase">
                    Apply Coupon
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
