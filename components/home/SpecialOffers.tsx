/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { wishlistService } from "@/lib/services/wishlist.service";
import { ApiError } from "@/types/api";
import { cartService } from "@/lib/services/cart.service";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useGetCartItems, useGetProducts, useGetWishlistItems } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
import { handleError } from "@/lib/handle-error";
import ErrorSection from "../ui/ErrorSection";
import { getAuthToken } from "@/lib/auth-utils";
import { useRouter } from "next/navigation";
import { CartItemDto } from "@/types/cart";
import useCheckIfExist from "@/hooks/useCheckIfExist";

/** Format a number as Naira, e.g. 45000 → "₦45,000" */
function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Fallback image when the product has no image. */
const PLACEHOLDER_IMAGE = "/assets/home/product-yellow-garri.png";

export default function SpecialOffers({
  onLoadingChange,
}: {
  onLoadingChange?: (isLoading: boolean) => void;
}) {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => new Set());
  const [wishlistPendingIds, setWishlistPendingIds] = useState<Set<string>>(() => new Set());
  const [wishlistItemIdByProductId, setWishlistItemIdByProductId] = useState<Map<string, string>>(
    () => new Map(),
  );
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const {
    data: productsData,
    error: productsError,
    isLoading: isProductsLoading,
    refetch: refetchProducts,
  } = useGetProducts();
  const { data: cartItemsResponse } = useGetCartItems();
  const { data: wishlistItemsData, refetch: refetchWishList } = useGetWishlistItems();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const token = getAuthToken();
  const router = useRouter();
  const { itemIds: cartPendingIds, setItemIds: setCartPendingIds } = useCheckIfExist({
    itemList: cartItemsResponse ? cartItemsResponse?.data : ([] as CartItemDto[]),
  });

  // Pick the first product as "featured" and the rest for the grid
  const featured = productsData ? productsData[0] : null;
  const gridProducts = productsData ? productsData.slice(1, 7) : []; // Show 6 in the grid

  const addToWishlist = async (productId: string) => {
    if (!token) {
      return router.replace("/login");
    }

    if (wishlistIds.has(productId)) {
      return toast({ variant: "info", title: "This product already exist in your wishlist" });
    }

    setWishlistIds((prev) => new Set(prev).add(productId));

    try {
      const existingItemId = wishlistItemIdByProductId.get(productId);
      if (existingItemId) {
        // Optimistic remove
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        setWishlistItemIdByProductId((prev) => {
          const next = new Map(prev);
          next.delete(productId);
          return next;
        });
        await wishlistService.deleteWishlistItem({ itemId: existingItemId });
        await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
        toast({ title: "Removed from wishlist", variant: "info" });
      } else {
        // Optimistic add
        setWishlistIds((prev) => new Set(prev).add(productId));
        await wishlistService.addToWishlist({ productId, quantity: 1 });
        await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
        toast({
          title: "Added to wishlist",
          description: "You can view it in your wishlist.",
          variant: "success",
        });

        const response = await refetchWishList();
        if (!response.data) return;

        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data.data ?? []) {
          const productId = item.productId;
          const wishlistItemId = item.id;
          if (typeof productId !== "string" || typeof wishlistItemId !== "string") continue;
          map.set(productId, wishlistItemId);
          ids.add(productId);
        }
        setWishlistItemIdByProductId(map);
        setWishlistIds(ids);
      }
    } catch (err) {
      try {
        const response = await refetchWishList();
        if (!response.data) return;

        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data.data ?? []) {
          const productId = item.productId;
          const wishlistItemId = item.id;
          if (typeof productId !== "string" || typeof wishlistItemId !== "string") continue;
          map.set(productId, wishlistItemId);
          ids.add(productId);
        }
        setWishlistItemIdByProductId(map);
        setWishlistIds(ids);
      } catch (error) {
        console.log(error);
        const message = err instanceof ApiError ? err.message : "Failed to update wishlist.";
        toast({
          title: "Wishlist update failed",
          description: message,
          variant: "error",
          durationMs: 3400,
        });
      }
      const message = err instanceof ApiError ? err.message : "Failed to update wishlist.";
      toast({
        title: "Wishlist update failed",
        description: message,
        variant: "error",
        durationMs: 3400,
      });
    } finally {
      setWishlistPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  const addToCart = async (productId: string) => {
    if (!token) {
      return router.replace("/login");
    }

    setIsAdding(true);

    setCartPendingIds((prev) => new Set(prev).add(productId));

    try {
      await cartService.addToCart({ productId, quantity: 1 });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getCart] });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to add to cart.";
      toast({ variant: "error", title: message });
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    onLoadingChange?.(isProductsLoading);
  }, [isProductsLoading, onLoadingChange]);

  // verify if item already exist in wishlist
  useEffect(() => {
    if (!wishlistItemsData) return;

    const map = new Map<string, string>();
    const ids = new Set<string>();

    for (const item of wishlistItemsData.data ?? []) {
      const productId = item.productId;
      const wishlistItemId = item._id;
      if (!productId || !wishlistItemId) return;

      map.set(productId, wishlistItemId);
      ids.add(productId);
    }
    setWishlistItemIdByProductId(map);
    setWishlistIds(ids);
  }, [wishlistItemsData]);

  if (productsError) {
    return (
      <ErrorSection
        message={handleError(productsError, "Something went wrong while fetching products.")}
        onRetry={refetchProducts}
      />
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
      <div className="flex items-center justify-between mb-8 relative">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 inline-block relative z-10 pb-2">
          Special Offers
          <div className="absolute bottom-0 left-0 w-1/2 h-0.75 bg-[#6cc200]" />
        </h2>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gray-200" />
        <Link
          href="/products"
          className="flex items-center gap-1 text-xs font-semibold text-[#6cc200] hover:text-[#5aad00] transition"
        >
          Browse Store
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Loading Skeleton (blur overlay handled globally on Home) */}
      {isProductsLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="bg-white border border-gray-100 rounded-sm p-4 animate-pulse">
            <div className="w-full h-45 bg-gray-100 rounded-md mb-4" />
            <div className="h-4 bg-gray-100 rounded w-2/3 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/3 mb-4" />
            <div className="h-3 bg-gray-100 rounded w-full mb-1" />
            <div className="h-3 bg-gray-100 rounded w-5/6 mb-6" />
            <div className="flex gap-2">
              <div className="size-8 bg-gray-100 rounded-sm" />
              <div className="flex-1 h-8 bg-gray-100 rounded-sm" />
              <div className="size-8 bg-gray-100 rounded-sm" />
            </div>
          </div>

          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-gray-100 rounded-sm p-3 animate-pulse"
              >
                <div className="w-full h-35 bg-gray-100 rounded mb-3" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      ) : !productsData || productsData.length < 1 ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">No products available at the moment.</p>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Featured Product */}
          {featured && (
            <div className="bg-[#fcf8e3] rounded-sm p-4 flex flex-col border border-gray-100 shadow-sm relative overflow-hidden h-full hover:shadow-lg transition-shadow">
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  Special
                </span>
              </div>

              <div className="w-full h-45 relative rounded-md overflow-hidden bg-[#cde8b4] mb-4 z-10 flex items-center justify-center p-2">
                {featured.image?.startsWith("http") ? (
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="size-40 object-contain"
                    loading="lazy"
                  />
                ) : (
                  <Image
                    src={featured.image || PLACEHOLDER_IMAGE}
                    alt={featured.name}
                    width={160}
                    height={160}
                    className="object-contain"
                  />
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-800 mb-1">{featured.name}</h3>
              <p className="text-base font-bold text-[#6cc200] mb-3">
                {formatPrice(featured.price)}
              </p>
              <p className="text-[10px] text-gray-500 mb-6 flex-1 line-clamp-3">
                {featured.description || "Premium quality product"}
              </p>
              <div className="flex items-center gap-2 mt-auto">
                <button
                  type="button"
                  className="size-8 rounded-sm bg-[#f0f9e0] flex items-center justify-center hover:bg-[#e4f5cc] transition cursor-pointer"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToWishlist(featured._id);
                  }}
                  disabled={wishlistPendingIds.has(featured._id)}
                  aria-label="Add to wishlist"
                >
                  <Heart
                    fill={wishlistIds.has(featured._id) ? "#fb2c36" : ""}
                    className={`size-4 ${wishlistIds.has(featured._id) ? "text-red-500" : "text-[#6cc200]"}`}
                  />
                </button>
                <button
                  type="button"
                  className="disabled:opacity-50 flex-1 flex items-center justify-center gap-2 bg-[#6cc200] text-white h-8 rounded-sm text-[10px] font-bold hover:bg-[#5aad00] transition cursor-pointer disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(featured._id);
                  }}
                  disabled={cartPendingIds.has(featured._id) || !featured.isAvailable || isAdding}
                >
                  <ShoppingCart className="size-3.5" />
                  {cartPendingIds.has(featured._id)
                    ? "ALREADY IN YOUR CART"
                    : isAdding
                      ? "ADDING TO YOUR CART..."
                      : "ADD TO CART"}
                </button>

                <Link
                  href={`/products/${featured._id}`}
                  className="size-8 rounded-sm bg-[#f0f9e0] flex items-center justify-center hover:bg-[#e4f5cc] transition text-[#6cc200] cursor-pointer"
                >
                  <Eye className="size-4" />
                </Link>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {gridProducts.map((product) => (
              <Link
                href={`/products/${product._id}`}
                key={product._id}
                className="bg-white border border-gray-100 rounded-sm p-3 hover:shadow-md transition group h-full flex flex-col relative"
              >
                {!product.isAvailable && (
                  <div className="absolute top-2 left-2 z-10">
                    <span className="bg-gray-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm uppercase tracking-wider">
                      Sold Out
                    </span>
                  </div>
                )}

                {product.discount?.isDiscount && (
                  <div className="absolute top-2 right-2 z-10">
                    <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm">
                      {product.discount.percentage ?? ""}% OFF
                    </span>
                  </div>
                )}

                <div className="relative w-full h-35 bg-white mb-2 flex items-center justify-center">
                  {product.image?.startsWith("http") ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className={`absolute inset-0 size-full object-contain ${!product.isAvailable ? "opacity-60 mix-blend-multiply" : ""}`}
                      loading="lazy"
                    />
                  ) : (
                    <Image
                      src={product.image || PLACEHOLDER_IMAGE}
                      alt={product.name}
                      fill
                      className={`object-contain ${!product.isAvailable ? "opacity-60 mix-blend-multiply" : ""}`}
                    />
                  )}
                </div>
                <h4 className="text-[11px] font-bold text-gray-700 mt-auto">{product.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className="text-[11px] font-bold text-[#6cc200]">
                    {formatPrice(product.price)}
                  </span>
                  <span className="text-gray-300 text-[10px]">|</span>
                  <span className="text-[10px] text-gray-400">{product.measurement}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
