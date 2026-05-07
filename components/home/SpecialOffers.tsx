"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Heart, ShoppingCart, ArrowRight, Eye } from "lucide-react";
import Link from "next/link";
import { productService } from "@/lib/services/product.service";
import type { ProductDto } from "@/types/product";
import { wishlistService } from "@/lib/services/wishlist.service";
import { ApiError } from "@/types/api";
import { cartService } from "@/lib/services/cart.service";
import { useToast } from "@/components/ui/toast/ToastProvider";

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
  const { toast } = useToast();
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => new Set());
  const [wishlistPendingIds, setWishlistPendingIds] = useState<Set<string>>(() => new Set());
  const [wishlistItemIdByProductId, setWishlistItemIdByProductId] = useState<Map<string, string>>(
    () => new Map(),
  );
  const [cartPendingIds, setCartPendingIds] = useState<Set<string>>(() => new Set());

  useEffect(() => {
    let cancelled = false;

    async function fetchProducts() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await productService.getProducts();
        if (!cancelled) {
          setProducts(data);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load products. Please try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchProducts();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    onLoadingChange?.(isLoading);
  }, [isLoading, onLoadingChange]);

  useEffect(() => {
    let cancelled = false;
    const token = typeof window !== "undefined" ? sessionStorage.getItem("fb4u_token") : null;
    if (!token) return;

    async function fetchWishlist() {
      try {
        const response = await wishlistService.getWishlistItems();
        if (cancelled) return;
        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data ?? []) {
          const productId = item.productId;
          const wishlistItemId = item.id;
          if (typeof productId !== "string" || typeof wishlistItemId !== "string") continue;
          map.set(productId, wishlistItemId);
          ids.add(productId);
        }
        setWishlistItemIdByProductId(map);
        setWishlistIds(ids);
      } catch {
        // ignore
      }
    }

    fetchWishlist();
    return () => {
      cancelled = true;
    };
  }, []);

  // Pick the first product as "featured" and the rest for the grid
  const featured = products[0] ?? null;
  const gridProducts = products.slice(1, 7); // Show 6 in the grid

  const addToWishlist = async (productId: string) => {
    const token = typeof window !== "undefined" ? sessionStorage.getItem("fb4u_token") : null;
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (wishlistPendingIds.has(productId)) return;

    setWishlistPendingIds((prev) => new Set(prev).add(productId));

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
        toast({ title: "Removed from wishlist", variant: "info" });
      } else {
        // Optimistic add
        setWishlistIds((prev) => new Set(prev).add(productId));
        await wishlistService.addToWishlist({ productId, quantity: 1 });
        toast({
          title: "Added to wishlist",
          description: "You can view it in your wishlist.",
          variant: "success",
        });

        const response = await wishlistService.getWishlistItems();
        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data ?? []) {
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
        const response = await wishlistService.getWishlistItems();
        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data ?? []) {
          const productId = item.productId;
          const wishlistItemId = item.id;
          if (typeof productId !== "string" || typeof wishlistItemId !== "string") continue;
          map.set(productId, wishlistItemId);
          ids.add(productId);
        }
        setWishlistItemIdByProductId(map);
        setWishlistIds(ids);
      } catch {
        // ignore
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
    const token = typeof window !== "undefined" ? sessionStorage.getItem("fb4u_token") : null;
    if (!token) {
      window.location.href = "/login";
      return;
    }
    if (cartPendingIds.has(productId)) return;
    setCartPendingIds((prev) => new Set(prev).add(productId));
    try {
      await cartService.addToCart({ packageId: productId, quantity: 1 });
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to add to cart.";
      toast({ variant: "error", title: message });
    } finally {
      setCartPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-8">
      <div className="flex items-center justify-between mb-8 relative">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 inline-block relative z-10 pb-2">
          Special Offers
          <div className="absolute bottom-0 left-0 w-1/2 h-[3px] bg-[#6cc200]" />
        </h2>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200" />
        <Link
          href="/products"
          className="flex items-center gap-1 text-xs font-semibold text-[#6cc200] hover:text-[#5aad00] transition"
        >
          Browse Store
          <ArrowRight className="size-3" />
        </Link>
      </div>

      {/* Loading Skeleton (blur overlay handled globally on Home) */}
      {isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          <div className="bg-white border border-gray-100 rounded-sm p-4 animate-pulse">
            <div className="w-full h-[180px] bg-gray-100 rounded-md mb-4" />
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
                <div className="w-full h-[140px] bg-gray-100 rounded mb-3" />
                <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-[#6cc200] hover:underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Products Grid */}
      {!isLoading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Featured Product */}
          {featured && (
            <Link
              href={`/products/${featured._id}`}
              className="bg-[#fcf8e3] rounded-sm p-4 flex flex-col border border-gray-100 shadow-sm relative overflow-hidden h-full hover:shadow-lg transition-shadow"
            >
              <div className="absolute top-4 left-4 z-20">
                <span className="bg-yellow-400 text-black text-[10px] font-bold px-2 py-0.5 rounded-sm">
                  Special
                </span>
              </div>

              <div className="w-full h-[180px] relative rounded-md overflow-hidden bg-[#cde8b4] mb-4 z-10 flex items-center justify-center p-2">
                {featured.image?.startsWith("http") ? (
                  <img
                    src={featured.image}
                    alt={featured.name}
                    className="size-[160px] object-contain"
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
                    className={`size-4 ${wishlistIds.has(featured._id) ? "text-red-500" : "text-[#6cc200]"}`}
                  />
                </button>
                <button
                  type="button"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#6cc200] text-white h-8 rounded-sm text-[10px] font-bold hover:bg-[#5aad00] transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    addToCart(featured._id);
                  }}
                  disabled={cartPendingIds.has(featured._id) || !featured.isAvailable}
                >
                  <ShoppingCart className="size-3.5" />
                  ADD TO CART
                </button>
                <button className="size-8 rounded-sm bg-[#f0f9e0] flex items-center justify-center hover:bg-[#e4f5cc] transition text-[#6cc200] cursor-pointer">
                  <Eye className="size-4" />
                </button>
              </div>
            </Link>
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

                <div className="relative w-full h-[140px] bg-white mb-2 flex items-center justify-center">
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

      {/* Empty State */}
      {!isLoading && !error && products.length === 0 && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-400 text-sm">No products available at the moment.</p>
        </div>
      )}
    </section>
  );
}
