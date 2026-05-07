/* eslint-disable @next/next/no-img-element */
"use client";

import React, { Suspense, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Home, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import TopRibbon from "@/components/layout/TopRibbon";
import Header from "@/components/layout/Header";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/layout/Footer";
import { categoryService } from "@/lib/services/category.service";
import { productService } from "@/lib/services/product.service";
import type { CategoryDto } from "@/types/category";
import type { ProductDto } from "@/types/product";

/** Capitalise each word, e.g. "frozen foods" → "Frozen Foods". */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatPrice(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

const PLACEHOLDER_IMAGE = "/assets/first_grain.png";
const PREVIEW_PER_CATEGORY = 4;
const CATEGORIES_PER_PAGE = 5;

function ProductsPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pageParamRaw = (searchParams.get("page") ?? "1").trim();
  const pageParam = Number.isFinite(Number(pageParamRaw)) ? Math.max(1, Number(pageParamRaw)) : 1;

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [products, setProducts] = useState<ProductDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setIsLoading(true);
        setError(null);
        const [cats, prods] = await Promise.all([
          categoryService.getCategories(),
          productService.getProducts(),
        ]);
        if (cancelled) return;

        setCategories(cats.data ?? []);
        setProducts(prods ?? []);
      } catch {
        if (!cancelled) setError("Failed to load store. Please try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const productsByType = useMemo(() => {
    const map = new Map<string, ProductDto[]>();
    for (const p of products) {
      const key = (p.type ?? "").toLowerCase();
      if (!key) continue;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(p);
    }
    return map;
  }, [products]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(categories.length / CATEGORIES_PER_PAGE));
  }, [categories.length]);

  const currentPage = Math.min(pageParam, totalPages);

  const pagedCategories = useMemo(() => {
    const start = (currentPage - 1) * CATEGORIES_PER_PAGE;
    return categories.slice(start, start + CATEGORIES_PER_PAGE);
  }, [categories, currentPage]);

  useEffect(() => {
    // If URL contains out-of-range page, clamp it.
    if (pageParam !== currentPage) {
      const params = new URLSearchParams(searchParams.toString());
      if (currentPage === 1) params.delete("page");
      else params.set("page", String(currentPage));
      router.replace(`/products?${params.toString()}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage]);

  const setPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    const clamped = Math.min(Math.max(1, nextPage), totalPages);
    if (clamped === 1) params.delete("page");
    else params.set("page", String(clamped));
    router.push(`/products?${params.toString()}`);
  };

  return (
    <main className="min-h-screen bg-gray-50/50 flex flex-col pt-0">
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
          <span className="text-gray-400">Store</span>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">Store</h1>
          <p className="text-sm text-gray-500">Browse categories and discover products.</p>
        </div>

        {/* Parent Container */}
        <div className="w-full bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {/* Categories Container */}
          <div className="p-6">
            {isLoading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="size-7 animate-spin text-[#6cc200]" />
                <span className="ml-3 text-gray-500 text-sm">Loading store…</span>
              </div>
            )}

            {!isLoading && error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-6 py-6 text-sm text-red-600">
                {error}
              </div>
            )}

            {!isLoading && !error && (
              <div className="space-y-10">
                {pagedCategories.map((cat) => {
                  const type = (cat.type ?? "").toLowerCase();
                  const list = productsByType.get(type) ?? [];
                  const preview = list.slice(0, PREVIEW_PER_CATEGORY);

                  return (
                    <section
                      key={cat._id}
                      className="bg-white border border-gray-100 rounded-xl overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <h2 className="text-sm font-bold text-gray-900 truncate">
                            {capitalizeWords(cat.type)}
                          </h2>
                          <p className="text-xs text-gray-500 mt-0.5">{list.length} items</p>
                        </div>

                        <Link
                          href={`/search?type=${encodeURIComponent(cat.type)}`}
                          className="text-xs font-semibold text-[#6cc200] hover:text-[#5aad00] transition whitespace-nowrap"
                        >
                          Browse more →
                        </Link>
                      </div>

                      <div className="p-5 sm:p-6">
                        {preview.length === 0 ? (
                          <p className="text-sm text-gray-500">No products in this category yet.</p>
                        ) : (
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {preview.map((p) => (
                              <Link
                                key={p._id}
                                href={`/products/${p._id}`}
                                className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow group flex flex-col"
                              >
                                <div className="relative w-full aspect-square mb-3 flex items-center justify-center p-2 bg-gray-50 rounded-lg">
                                  {p.image?.startsWith("http") ? (
                                    <img
                                      src={p.image}
                                      alt={p.name}
                                      className="absolute inset-0 size-full object-contain group-hover:scale-105 transition-transform duration-300"
                                      loading="lazy"
                                    />
                                  ) : (
                                    <Image
                                      src={p.image || PLACEHOLDER_IMAGE}
                                      alt={p.name}
                                      fill
                                      className="object-contain group-hover:scale-105 transition-transform duration-300"
                                    />
                                  )}
                                </div>

                                <div className="mt-auto">
                                  <p className="text-[13px] font-bold text-gray-800 mb-1 line-clamp-2">
                                    {p.name}
                                  </p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[#8ced00] font-bold text-sm tracking-tight">
                                      {formatPrice(p.price)}
                                    </span>
                                    <span className="text-gray-300 text-[10px]">|</span>
                                    <span className="text-xs text-gray-400 font-medium">
                                      {p.measurement}
                                    </span>
                                  </div>
                                </div>
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    </section>
                  );
                })}

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
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
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={null}>
      <ProductsPageInner />
    </Suspense>
  );
}
