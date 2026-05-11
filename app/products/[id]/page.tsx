/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Home, ChevronRight, Heart, Minus, Plus, ShoppingCart, Loader2 } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopRibbon from "@/components/layout/TopRibbon";
import NavBar from "@/components/home/NavBar";
import AddToCartModal from "@/components/ui/AddToCartModal";
import type { ProductDto } from "@/types/product";
import { wishlistService } from "@/lib/services/wishlist.service";
import { ApiError } from "@/types/api";
import { cartService } from "@/lib/services/cart.service";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useGetCartItems, useGetProducts, useGetWishlistItems } from "@/lib/queries";
import { handleError } from "@/lib/handle-error";
import useCheckIfExist from "@/hooks/useCheckIfExist";
import { CartItemDto } from "@/types/cart";
import { WishlistItemDto } from "@/types/wishlist";
import { useQueryClient } from "@tanstack/react-query";

/** Fallback image when the product has no image. */
const PLACEHOLDER_IMAGE = "/assets/home/product-yellow-garri.png";

/** Format a number as Naira, e.g. 45000 → "₦45,000" */
function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Capitalise the first letter of a string. */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { toast } = useToast();

  const [product, setProduct] = useState<ProductDto | null>(null);
  const [similarProducts, setSimilarProducts] = useState<ProductDto[]>([]);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isAddedModalOpen, setIsAddedModalOpen] = useState(false);
  const [cartPending, setCartPending] = useState(false);
  const [wishlistPending, setWishlistPending] = useState(false);
  const [productItemId, setProductItemId] = useState<string>("");

  const {
    data: productsData,
    error: productsError,
    isLoading: isProductsLoading,
  } = useGetProducts();
  const queryClient = useQueryClient();

  const { data: cartItemsResponse } = useGetCartItems();
  const { data: wishlistItemsData, refetch: refetchWishList } = useGetWishlistItems();

  const { itemIds: cartPendingIds, setItemIds: setCartPendingIds } = useCheckIfExist({
    itemList: cartItemsResponse ? cartItemsResponse?.data : ([] as CartItemDto[]),
  });

  const { itemIds: wishListIds, setItemIds: setWishListIds } = useCheckIfExist({
    itemList: wishlistItemsData ? wishlistItemsData?.data : ([] as WishlistItemDto[]),
  });

  const isWishListed = wishListIds.has(id);
  const isInCart = cartPendingIds.has(id);

  const productImage = product ? product.image || PLACEHOLDER_IMAGE : PLACEHOLDER_IMAGE;

  const increaseQuantity = () => setQuantity((prevQuantity) => prevQuantity + 1);
  const decreaseQuantity = () =>
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));

  const addToWishlist = async () => {
    if (!product) return;

    setWishlistPending(true);

    try {
      if (isWishListed) {
        await wishlistService.deleteWishlistItem({ itemId: productItemId });
        await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
        wishListIds.delete(id);
        toast({ title: "Removed from wishlist", variant: "info" });
      } else {
        await wishlistService.addToWishlist({ productId: product._id, quantity: 1 });
        await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
        toast({
          title: "Added to wishlist",
          description: "You can view it in your wishlist.",
          variant: "success",
        });

        const response = await refetchWishList();
        if (!response.data) return;

        const match = (response.data.data ?? []).find((w) => w.productId === product._id) ?? null;
        if (!match) return;

        setWishListIds((prev) => new Set(prev).add(match.id as string));
      }
    } catch {
      // Roll back by refetching wishlist state for this product
      try {
        const response = await refetchWishList();
        if (!response.data) return;

        const match = (response.data.data ?? []).find((w) => w.productId === product._id) ?? null;
        if (!match) return;

        setWishListIds((prev) => new Set(prev).add(match.id as string));
      } catch (error) {
        console.log(error);
        toast({ variant: "error", title: handleError(error) });
      }
    } finally {
      setWishlistPending(false);
    }
  };

  const addToCart = async () => {
    if (!product || !product.isAvailable) return;

    setCartPending(true);

    try {
      await cartService.addToCart({ productId: product._id, quantity });
      await queryClient.invalidateQueries({ queryKey: [queryKeys.getCart] });
      setCartPendingIds((prev) => new Set(prev).add(id));
      setIsAddedModalOpen(true);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : "Failed to add to cart.";
      toast({ variant: "error", title: message });
    } finally {
      setCartPending(false);
    }
  };

  useEffect(() => {
    if (!wishlistItemsData) return;

    const match = (wishlistItemsData.data ?? []).find((w) => w.productId === id) ?? null;
    if (!match) return;

    setProductItemId(match._id as string);
    setWishListIds((prev) => new Set(prev).add(match.id as string));
  }, [id, setWishListIds, wishlistItemsData]);

  useEffect(() => {
    if (!productsData) return;

    const found = productsData.find((p) => p._id === id) ?? null;
    if (!found) return;

    // Get similar products: same type, exclude current, max 4
    const similarProducts = productsData
      .filter((p) => p.type === found.type && p._id !== found._id)
      .slice(0, 4);

    setProduct(found);
    setSimilarProducts(similarProducts);
  }, [id, productsData]);

  // ── Loading State ────────────────────────────────────────────────
  if (isProductsLoading) {
    return (
      <main className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
        <TopRibbon />
        <Header />
        <NavBar />
        <div className="flex-1 flex items-center justify-center py-32">
          <Loader2 className="size-8 animate-spin text-[#6cc200]" />
          <span className="ml-3 text-gray-500 text-sm">Loading product…</span>
        </div>
        <Footer />
      </main>
    );
  }

  // ── Error State ──────────────────────────────────────────────────
  if (productsError || !product) {
    return (
      <main className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
        <TopRibbon />
        <Header />
        <NavBar />
        <div className="flex-1 flex flex-col items-center justify-center py-32 gap-4">
          <p className="text-red-500 text-sm">
            {handleError(productsError) ?? "Product not found."}
          </p>
          <Link href="/" className="text-sm font-medium text-[#6cc200] hover:underline">
            ← Back to Home
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <TopRibbon />
      <Header />
      <NavBar />

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-xs text-gray-500">
          <Link href="/" className="flex items-center hover:text-[#70c400] transition">
            <Home className="size-3.5 mr-1" />
            Home
          </Link>
          <ChevronRight className="size-3 mx-2 text-gray-400" />
          <Link href="/products" className="hover:text-[#70c400] transition">
            Store
          </Link>
          <ChevronRight className="size-3 mx-2 text-gray-400" />
          <span className="text-gray-400">{capitalize(product.type)}</span>
          <ChevronRight className="size-3 mx-2 text-gray-400" />
          <span className="text-[#8ced00] font-medium">{product.name}</span>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {/* Product Hero */}
        <div className="flex flex-col md:flex-row gap-10 lg:gap-16 mb-16">
          {/* Product Image */}
          <div
            className="md:w-1/2 rounded-lg p-8 sm:p-12 border border-gray-100 flex items-center justify-center relative shadow-sm min-h-100"
            style={{ background: "linear-gradient(to bottom, #d9d9d9 0%, #e8e8e8 100%)" }}
          >
            <div className="relative size-full max-w-100 aspect-square flex items-center justify-center">
              {productImage.startsWith("http") ? (
                <img
                  src={productImage}
                  alt={product.name}
                  className="absolute inset-0 size-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              ) : (
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                />
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="md:w-1/2 flex flex-col pt-4">
            <span className="text-xs text-gray-400 font-medium mb-2 w-full text-right sm:text-left">
              ({product.soldOut} people bought this)
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>

            <div className="space-y-2 mb-6 text-sm">
              <div>
                <span className="text-gray-500 font-medium mr-2">Category:</span>
                <span className="text-gray-800 font-bold">{capitalize(product.type)}</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium mr-2">Availability:</span>
                <span
                  className={`font-bold ${product.isAvailable ? "text-[#70c400]" : "text-red-500"}`}
                >
                  {product.isAvailable ? "In Stock" : "Out of Stock"}
                </span>
              </div>
              {product.warehouse && (
                <div>
                  <span className="text-gray-500 font-medium mr-2">Warehouse:</span>
                  <span className="text-gray-800 font-bold">
                    {product.warehouse.storeName} ({capitalize(product.warehouse.location)})
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-2xl font-bold text-[#8ced00]">
                {formatPrice(product.price)}
              </span>
              <span className="bg-[#f57422] text-white text-xs font-bold px-3 py-1 rounded shadow-sm">
                {product.measurement}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center border border-gray-200 rounded-md w-30 h-11.5">
                <button
                  onClick={decreaseQuantity}
                  className="w-1/3 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition border-r border-gray-100"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-4" />
                </button>
                <div className="w-1/3 h-full flex items-center justify-center text-gray-800 font-bold text-sm">
                  {quantity < 10 ? `0${quantity}` : quantity}
                </div>
                <button
                  onClick={increaseQuantity}
                  className="w-1/3 h-full flex items-center justify-center text-gray-500 hover:text-gray-800 hover:bg-gray-50 transition border-l border-gray-100"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-4" />
                </button>
              </div>

              <button
                className={`flex-1 disabled:opacity-50 disabled:cursor-not-allowed sm:flex-none sm:w-55 h-11.5 flex items-center justify-center gap-2 rounded-md font-bold text-sm shadow-md transition-colors active:scale-[0.98] ${
                  product.isAvailable
                    ? "bg-[#f57422] hover:bg-[#e06518] text-white cursor-pointer"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
                onClick={addToCart}
                disabled={!product.isAvailable || cartPending || isInCart}
              >
                {product.isAvailable
                  ? cartPending
                    ? "Adding..."
                    : isInCart
                      ? "ALREADY IN CART"
                      : "ADD TO CART"
                  : "OUT OF STOCK"}
                <ShoppingCart className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={addToWishlist}
              disabled={wishlistPending}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 group transition-colors w-max disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <Heart
                fill={isWishListed ? "#fb2c36" : ""}
                className={`size-4 transition-colors ${isWishListed ? "text-red-500" : "text-gray-400 group-hover:text-red-500"}`}
              />
              <span className="font-medium">{`${isWishListed ? "Remove" : "Add"} to Wishlist`}</span>
            </button>
          </div>
        </div>

        {/* Description Tab */}
        <div className="mb-16">
          <div className="flex border-b border-gray-200 gap-8 mb-6">
            <button
              className={`pb-3 text-sm font-bold uppercase tracking-wide transition-colors relative ${activeTab === "description" ? "text-gray-800" : "text-gray-400 hover:text-gray-600"}`}
              onClick={() => setActiveTab("description")}
            >
              DESCRIPTION
              {activeTab === "description" && (
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f57422]" />
              )}
            </button>
          </div>

          <div className="text-sm text-gray-500 leading-relaxed max-w-4xl">
            {activeTab === "description" && (
              <div className="space-y-4">
                <h3 className="font-bold text-gray-800">{product.name}</h3>
                <p>{product.description || "No description available for this product."}</p>
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="bg-gray-50 rounded-md px-4 py-3 border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase block mb-1">
                      Weight/Size
                    </span>
                    <span className="text-sm font-bold text-gray-800">{product.measurement}</span>
                  </div>
                  <div className="bg-gray-50 rounded-md px-4 py-3 border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase block mb-1">Type</span>
                    <span className="text-sm font-bold text-gray-800">
                      {capitalize(product.type)}
                    </span>
                  </div>
                  <div className="bg-gray-50 rounded-md px-4 py-3 border border-gray-100">
                    <span className="text-[10px] text-gray-400 uppercase block mb-1">Stock</span>
                    <span className="text-sm font-bold text-gray-800">
                      {product.quantity} available
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products */}
        {similarProducts.length > 0 && (
          <div>
            <div className="flex border-b border-gray-200 gap-8 mb-8">
              <h2 className="pb-3 text-sm font-bold uppercase tracking-wide text-gray-800 relative">
                SIMILAR PRODUCTS
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#f57422]" />
              </h2>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
              {similarProducts.map((item) => (
                <Link
                  href={`/products/${item._id}`}
                  key={item._id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col cursor-pointer"
                >
                  <button className="absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-300 hover:text-red-500 active:scale-95 transition-all">
                    <Heart className="size-4" />
                  </button>

                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center p-2">
                    <Image
                      src={item.image ?? PLACEHOLDER_IMAGE}
                      alt={item.name}
                      fill
                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="mt-auto">
                    <h3 className="text-[13px] font-bold text-gray-800 mb-1 line-clamp-2">
                      {item.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8ced00] font-bold text-sm tracking-tight">
                        {formatPrice(item.price)}
                      </span>
                      <div className="w-px h-3 bg-gray-300" />
                      <span className="text-xs text-gray-400 font-medium">{item.measurement}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <AddToCartModal isOpen={isAddedModalOpen} onClose={() => setIsAddedModalOpen(false)} />

      <Footer />
    </main>
  );
}
