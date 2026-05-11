"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Home, Loader2 } from "lucide-react";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CategoryDropdown from "@/components/layout/CategoryDropdown";
import { wishlistService } from "@/lib/services/wishlist.service";
import type { WishlistItem } from "@/types/wishlist";
import { toWishlistItem } from "@/types/wishlist";
import { cartService } from "@/lib/services/cart.service";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-utils";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import { ApiError } from "@/types/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useGetWishlistItems } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";

export default function WishlistPage() {
  const { toast } = useToast();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [cartPendingIds, setCartPendingIds] = useState<Set<string>>(() => new Set());
  const router = useRouter();
  const {
    data: wishlistItemsData,
    error: wishlistItemsError,
    isLoading: wishlistItemsLoading,
    refetch: refetchWishlistItems,
  } = useGetWishlistItems();
  const token = getAuthToken();
  const queryClient = useQueryClient();

  const removeItem = async (id: string) => {
    // Optimistic removal — instantly update the UI
    const previousItems = wishlistItems;
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));

    try {
      await wishlistService.deleteWishlistItem({ itemId: id });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
    } catch (error) {
      // Roll back on failure and notify the user
      setWishlistItems(previousItems);
      toast({
        variant: "error",
        title: handleError(error, "Failed to remove item. Please try again."),
      });
    }
  };

  const addToCart = async (productId: string) => {
    if (cartPendingIds.has(productId)) return;

    setCartPendingIds((prev) => new Set(prev).add(productId));

    try {
      await cartService.addToCart({
        productId,
        quantity: 1,
      });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getCart] });

      toast({
        variant: "success",
        title: "Item added to cart.",
      });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to add to cart.";

      toast({
        variant: "error",
        title: message,
      });
    } finally {
      setCartPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  useEffect(() => {
    if (!wishlistItemsData) return;

    const items = (wishlistItemsData.data ?? []).map(toWishlistItem);
    setWishlistItems(items);
  }, [wishlistItemsData]);

  if (wishlistItemsError) {
    setError(handleError(wishlistItemsError, "Something went wrong while fetching your wishlist."));
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <TopRibbon />
      <Header />
      <nav className="bg-[#f4faee] border-b border-gray-100 py-3 relative z-10 w-full">
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
            <span className="text-gray-800">Wish List</span>
          </div>

          <div className="hidden md:flex items-center gap-6">
            <CategoryDropdown triggerStyle="pageNav" />

            <Link
              href="#"
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
              href="#"
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
              href="#"
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
            <h2 className="text-lg font-bold text-gray-800 mb-2">Login to access your wishlist</h2>
            <button
              onClick={() => router.push("/login")}
              className="bg-blue-400 text-white px-6 py-2.5 rounded-md font-bold text-sm transition-colors uppercase tracking-wide"
            >
              Login
            </button>
          </div>
        </section>
      ) : wishlistItemsLoading ? (
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-24 flex flex-col items-center justify-center text-center">
          <Loader2 className="size-10 text-[#8cc629] animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading your wishlist…</p>
        </main>
      ) : error ? (
        <ErrorSection message={error} onRetry={refetchWishlistItems} />
      ) : (
        <main className="flex-1 w-full max-w-300 mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-sm min-h-125">
            <div className="px-6 py-5 border-b border-gray-100 text-left">
              <h1 className="text-[17px] font-semibold text-gray-800 tracking-wide">Wishlist</h1>
            </div>

            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse min-w-200">
                <thead>
                  <tr className="bg-[#f0f3f6] text-[11px] font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                    <th className="px-6 py-4">PRODUCTS</th>
                    <th className="px-6 py-4 text-center">PRICE</th>
                    <th className="px-6 py-4 text-center">STOCK STATUS</th>
                    <th className="px-6 py-4 text-center">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {wishlistItems.map((item) => (
                    <tr key={item.id} className="group hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative size-16 bg-white shrink-0">
                            {item.image?.startsWith("http") ? (
                              <Image
                                src={item.image}
                                alt={item.name}
                                className="absolute inset-0 size-full object-contain"
                                loading="lazy"
                                width={50}
                                height={50}
                                onError={(e) => {
                                  (e.currentTarget as HTMLImageElement).src =
                                    "/assets/foodbank-logo-4-1.png";
                                }}
                              />
                            ) : (
                              <Image
                                src={item.image || "/assets/foodbank-logo-4-1.png"}
                                alt={item.name}
                                width={50}
                                height={50}
                                fill
                                className="object-contain"
                              />
                            )}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-gray-700">{item.name}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 uppercase tracking-wide">
                              {item.category}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-[13px] font-bold text-gray-700 text-center">
                        ₦{item.price.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`text-[11px] font-semibold uppercase ${item.inStock ? "text-[#8cc629]" : "text-[#ff6b6b]"}`}
                        >
                          {item.inStock ? "IN STOCK" : "OUT OF STOCK"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            className={`text-white text-[11px] font-bold px-5 py-2.5 rounded-sm uppercase flex items-center justify-center gap-2 transition-colors min-w-35 ${item.inStock ? "bg-[#8cc629] hover:bg-[#7db424]" : "bg-[#aeb8c6] cursor-not-allowed text-white"}`}
                            onClick={() => addToCart(item.productId)}
                            disabled={!item.inStock || cartPendingIds.has(item.productId)}
                          >
                            ADD TO CART
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
                              <circle cx="8" cy="21" r="1" />
                              <circle cx="19" cy="21" r="1" />
                              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                            </svg>
                          </button>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors size-6 rounded-full border border-gray-200 hover:border-red-200 flex items-center justify-center"
                          >
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
                              <path d="M18 6 6 18M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {wishlistItems.length === 0 && (
                <div className="text-center py-20 text-gray-500 text-sm">
                  Your wishlist is currently empty.
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      <Footer />
    </div>
  );
}
