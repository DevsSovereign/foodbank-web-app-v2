/* eslint-disable @next/next/no-img-element */
"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ChevronDown, Heart, Home, ChevronRight, X } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import TopRibbon from "@/components/layout/TopRibbon";
import NavBar from "@/components/home/NavBar";
import { useRouter, useSearchParams } from "next/navigation";
import { wishlistService } from "@/lib/services/wishlist.service";
import { ApiError } from "@/types/api";
import { useToast } from "@/components/ui/toast/ToastProvider";
import { queryKeys, useGetCategories, useGetProducts, useGetWishlistItems } from "@/lib/queries";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import { useQueryClient } from "@tanstack/react-query";

/** Capitalise each word, e.g. "frozen foods" → "Frozen Foods". */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

const PAGE_SIZE = 8;

function SearchPageInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const q = (searchParams.get("q") ?? "").trim();
  const typeParam = (searchParams.get("type") ?? "").trim();
  const pageParamRaw = (searchParams.get("page") ?? "1").trim();
  const pageParam = Number.isFinite(Number(pageParamRaw)) ? Math.max(1, Number(pageParamRaw)) : 1;

  const [isSortOpen, setIsSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState(typeParam);
  const [searchText, setSearchText] = useState(q);
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(() => new Set());
  const [wishlistPendingIds, setWishlistPendingIds] = useState<Set<string>>(() => new Set());
  const [wishlistItemIdByProductId, setWishlistItemIdByProductId] = useState<Map<string, string>>(
    () => new Map(),
  );
  const {
    data: categoriesData,
    error: categoriesError,
    isLoading: isCategoriesLoading,
  } = useGetCategories();
  const {
    data: productsData,
    error: productsError,
    isLoading: isProductsLoading,
  } = useGetProducts();
  const { data: wishlistItemsData, error: wishlistItemsError } = useGetWishlistItems();
  const queryClient = useQueryClient();

  useEffect(() => {
    // Keep UI filter in sync with URL when navigating from the home category links.
    setSelectedSort(typeParam);
  }, [typeParam]);

  useEffect(() => {
    if (!wishlistItemsData) return;

    const map = new Map<string, string>();
    const ids = new Set<string>();
    for (const item of wishlistItemsData.data ?? []) {
      const productId = item.productId ?? item.packageId;
      const itemId = item.id ?? item._id;
      if (productId && itemId) {
        map.set(productId, itemId);
        ids.add(productId);
      }
    }
    setWishlistItemIdByProductId(map);
    setWishlistIds(ids);
  }, [wishlistItemsData]);

  const filteredProducts = useMemo(() => {
    if (!productsData) return [];

    const list = [...productsData];
    const query = (q || searchText).trim().toLowerCase();
    return list.filter((p) => {
      const matchesQuery = !query || p.name.toLowerCase().includes(query);
      const matchesType = !selectedSort || p.type.toLowerCase() === selectedSort.toLowerCase();
      return matchesQuery && matchesType;
    });
  }, [productsData, q, searchText, selectedSort]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  }, [filteredProducts.length]);

  const currentPage = Math.min(pageParam, totalPages);

  const pagedProducts = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredProducts.slice(start, start + PAGE_SIZE);
  }, [filteredProducts, currentPage]);

  useEffect(() => {
    // If URL contains out-of-range page, clamp it.
    if (pageParam !== currentPage) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(currentPage));
      router.replace(`/search?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === 1) params.delete("page");
    else params.set("page", String(clamped));
    router.push(`/search?${params.toString()}`);
  };

  const submitSearch = (text: string) => {
    const next = text.trim();
    if (!next) {
      router.push("/search");
      return;
    }
    const params = new URLSearchParams();
    params.set("q", next);
    const type = selectedSort.trim();
    if (type) params.set("type", type);
    // reset pagination when searching
    router.push(`/search?${params.toString()}`);
  };

  const addToWishlist = async (productId: string) => {
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
        await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
        toast({ title: "Removed from wishlist", variant: "info" });
      } else {
        // Optimistic add
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.add(productId);
          return next;
        });

        await wishlistService.addToWishlist({ productId, quantity: 1 });
        await queryClient.invalidateQueries({ queryKey: [queryKeys.getWishlist] });
        toast({
          title: "Added to wishlist",
          description: "You can view it in your wishlist.",
          variant: "success",
        });

        // Refresh wishlist to get the wishlist-item id for toggling later
        const response = await wishlistService.getWishlistItems();
        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data ?? []) {
          const productId = item.productId ?? item.packageId;
          const itemId = item.id ?? item._id;
          if (productId && itemId) {
            map.set(productId, itemId);
            ids.add(productId);
          }
        }
        setWishlistItemIdByProductId(map);
        setWishlistIds(ids);
      }
    } catch (err) {
      // Rollback by refetching wishlist
      try {
        const response = await wishlistService.getWishlistItems();
        const map = new Map<string, string>();
        const ids = new Set<string>();
        for (const item of response.data ?? []) {
          const productId = item.productId ?? item.packageId;
          const itemId = item.id ?? item._id;
          if (productId && itemId) {
            map.set(productId, itemId);
            ids.add(productId);
          }
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

  if (categoriesError) {
    return (
      <ErrorSection
        message={handleError(categoriesError, "Something went wrong while fetching categories.")}
      />
    );
  }
  if (productsError) {
    return (
      <ErrorSection
        message={handleError(productsError, "Something went wrong while fetching products.")}
      />
    );
  }
  if (wishlistItemsError) {
    return (
      <ErrorSection
        message={handleError(
          wishlistItemsError,
          "Something went wrong while fetching wishlist items.",
        )}
      />
    );
  }

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col pt-0">
      <TopRibbon />
      <Header />
      <NavBar />

      <div className="bg-white border-b border-gray-100 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center text-xs text-gray-500">
          <Link href="/" className="flex items-center hover:text-[#70c400] transition">
            <Home className="size-3.5 mr-1" />
            Home
          </Link>
          <ChevronRight className="size-3 mx-2 text-gray-400" />
          <span className="text-gray-400">Search</span>
          <ChevronRight className="size-3 mx-2 text-gray-400" />
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex gap-8">
        <aside className="hidden lg:block w-60 shrink-0">
          <h2 className="text-sm font-bold text-gray-800 mb-6 uppercase tracking-wide">
            Categories
          </h2>
          <ul className="space-y-4">
            {isCategoriesLoading ? (
              <span className="text-[13px] text-gray-400">Loading…</span>
            ) : !categoriesData?.data || categoriesData?.data.length === 0 ? (
              <span className="text-[13px] text-gray-400">No categories found.</span>
            ) : (
              categoriesData?.data.map((cat, idx) => {
                const isSelected = selectedSort === cat.type;
                return (
                  <li
                    key={cat._id ?? idx}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                      setSelectedSort(cat.type);
                      const nextQ = (searchText || q).trim();
                      const qPart = nextQ ? `q=${encodeURIComponent(nextQ)}&` : "";
                      router.push(`/search?${qPart}type=${encodeURIComponent(cat.type)}`);
                    }}
                  >
                    <div
                      className={`size-4 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? "border-[#70c400]" : "border-gray-200 group-hover:border-[#70c400]"}`}
                    >
                      {isSelected && <div className="size-2 rounded-full bg-[#70c400]" />}
                    </div>
                    <span
                      className={`text-[13px] ${isSelected ? "font-bold text-gray-800" : "text-gray-500 group-hover:text-gray-800"} transition-colors`}
                    >
                      {capitalizeWords(cat.type)}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </aside>

        <section className="flex-1">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-6">
            <div className="relative w-full sm:max-w-md">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submitSearch(searchText);
                }}
                className="relative"
              >
                <input
                  type="text"
                  placeholder="Search for anything..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-md text-sm outline-none focus:border-[#70c400] transition-colors shadow-sm"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                  aria-label="Search"
                >
                  <Search className="size-4 text-gray-400" />
                </button>
              </form>
            </div>

            <div className="relative w-full sm:w-auto">
              <div
                className="flex items-center gap-2 text-sm bg-white border border-gray-200 rounded-md px-3 py-2 shadow-sm cursor-pointer hover:border-gray-300 justify-between sm:justify-start"
                onClick={() => setIsSortOpen(!isSortOpen)}
              >
                <span className="text-gray-500">Sort by:</span>
                <span
                  className={
                    selectedSort
                      ? "font-bold text-[#70c400] mr-2 min-w-20"
                      : "font-medium text-gray-800 mr-2 min-w-20"
                  }
                >
                  {selectedSort || "Default"}
                </span>
                <ChevronDown
                  className={`size-4 text-gray-400 transition-transform ${isSortOpen ? "rotate-180" : ""}`}
                />
              </div>

              {isSortOpen && (
                <div className="absolute top-full right-0 mt-2 w-full sm:w-48 bg-white border border-gray-100 rounded-md shadow-lg z-50 py-1 max-h-64 overflow-y-auto">
                  {selectedSort && (
                    <button
                      className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors font-medium border-b border-gray-100 mb-1"
                      onClick={() => {
                        setSelectedSort("");
                        setIsSortOpen(false);
                      }}
                    >
                      Clear sorting
                    </button>
                  )}
                  {categoriesData?.data.map((cat, idx) => (
                    <button
                      key={cat._id ?? idx}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 transition-colors ${selectedSort === cat.type ? "text-[#70c400] font-bold bg-green-50/50" : "text-gray-600"}`}
                      onClick={() => {
                        setSelectedSort(cat.type);
                        setIsSortOpen(false);
                        const nextQ = (searchText || q).trim();
                        const qPart = nextQ ? `q=${encodeURIComponent(nextQ)}&` : "";
                        router.push(`/search?${qPart}type=${encodeURIComponent(cat.type)}`);
                      }}
                    >
                      {capitalizeWords(cat.type)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Filters Bar */}
          {selectedSort && (
            <div className="bg-white border border-gray-100 rounded-md py-3 px-4 mb-6 flex justify-between items-center shadow-sm">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-400 font-medium">Active Filters:</span>
                <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200 px-2 py-1 rounded text-xs font-semibold text-gray-700">
                  {selectedSort}
                  <X
                    className="size-3 text-gray-400 cursor-pointer hover:text-red-500 transition-colors"
                    onClick={() => setSelectedSort("")}
                  />
                </div>
              </div>
              <div className="text-xs">
                <span className="font-bold text-gray-800">{filteredProducts.length}</span>{" "}
                <span className="text-gray-400 font-medium">Results found.</span>
              </div>
            </div>
          )}

          {/* Search Results Count */}
          <div className="text-xs mb-5">
            <span className="font-bold text-gray-800">{filteredProducts.length}</span>{" "}
            <span className="text-gray-400 font-medium">Results found.</span>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5 mb-10">
            {isProductsLoading ? (
              <div className="col-span-full text-sm text-gray-500">Loading products…</div>
            ) : pagedProducts.length < 1 ? (
              <div className="col-span-full text-sm text-gray-500">No products found.</div>
            ) : (
              pagedProducts.map((product) => (
                <Link
                  href={`/products/${product._id}`}
                  key={product._id}
                  className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative flex flex-col cursor-pointer"
                >
                  {/* Favorite Heart */}
                  <button
                    className={`absolute top-3 right-3 z-10 p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 active:scale-95 transition-all ${
                      wishlistIds.has(product._id)
                        ? "text-red-500"
                        : "text-gray-300 hover:text-red-500"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      addToWishlist(product._id);
                    }}
                    disabled={wishlistPendingIds.has(product._id)}
                    aria-label="Add to wishlist"
                  >
                    <Heart className="size-4" />
                  </button>

                  {/* Product Image */}
                  <div className="relative w-full aspect-square mb-4 flex items-center justify-center p-2">
                    {product.image?.startsWith("http") ? (
                      // Use a plain <img> for remote URLs to avoid next/image host config issues.
                      // Keep layout identical to next/image's `fill`.
                      <img
                        src={product.image}
                        alt={product.name}
                        className="absolute inset-0 size-full object-contain group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <Image
                        src={product.image || "/assets/first_grain.png"}
                        alt={product.name}
                        fill
                        className="object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    )}
                  </div>

                  {/* Product Details */}
                  <div className="mt-auto">
                    <h3 className="text-[13px] font-bold text-gray-800 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[#8ced00] font-bold text-sm tracking-tight">
                        ₦{product.price.toLocaleString()}
                      </span>
                      <div className="w-px h-3 bg-gray-300" />
                      <span className="text-xs text-gray-400 font-medium">
                        {product.measurement}
                      </span>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setPage(currentPage - 1)}
              disabled={currentPage <= 1}
              className="size-8 rounded-full border border-gray-200 flex items-center justify-center text-[#70c400] hover:bg-[#70c400] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#70c400]"
              aria-label="Previous page"
            >
              <ChevronRight className="size-4 rotate-180" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .slice(0, 8)
              .map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`size-8 rounded-full font-medium text-xs flex items-center justify-center transition-colors ${
                    p === currentPage
                      ? "bg-[#8ced00] text-white font-bold shadow-sm"
                      : "text-gray-500 hover:bg-gray-100"
                  }`}
                >
                  {String(p).padStart(2, "0")}
                </button>
              ))}

            <button
              type="button"
              onClick={() => setPage(currentPage + 1)}
              disabled={currentPage >= totalPages}
              className="size-8 rounded-full border border-gray-200 flex items-center justify-center text-[#70c400] hover:bg-[#70c400] hover:text-white transition-colors disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-[#70c400]"
              aria-label="Next page"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={null}>
      <SearchPageInner />
    </Suspense>
  );
}
