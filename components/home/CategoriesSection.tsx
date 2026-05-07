"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { categoryService } from "@/lib/services/category.service";
import type { CategoryDto } from "@/types/category";

/** Capitalise each word, e.g. "frozen foods" → "Frozen Foods". */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Fallback image when the category has no valid image. */
const PLACEHOLDER_IMAGE = "/assets/first_grain.png";

export default function CategoriesSection({
  onLoadingChange,
}: {
  onLoadingChange?: (isLoading: boolean) => void;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        setIsLoading(true);
        setError(null);
        const response = await categoryService.getCategories();
        if (!cancelled) {
          // Filter out categories with broken/placeholder images
          const valid = response.data.filter(
            (c) => c.image && c.image.startsWith("http") && c.image.length > 10,
          );
          setCategories(valid);
        }
      } catch {
        if (!cancelled) {
          setError("Failed to load categories.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCategories();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    onLoadingChange?.(isLoading);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 250;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <div className="mb-8 relative">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 inline-block relative z-10 pb-2">
          Categories
          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#6cc200]" />
        </h2>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gray-200" />
      </div>

      {/* Loading Skeleton (blur overlay handled globally on Home) */}
      {isLoading && (
        <div className="bg-white rounded-sm border border-gray-100 p-4">
          <div className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-4 w-full">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="flex-shrink-0 w-[160px] md:w-[180px] bg-white border border-gray-100 rounded-sm p-3 flex flex-col items-center animate-pulse"
              >
                <div className="w-full h-[120px] md:h-[140px] rounded-xl bg-gray-100 mb-3" />
                <div className="w-full h-8 bg-gray-100 rounded-sm" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="flex flex-col items-center justify-center py-12 gap-2">
          <p className="text-red-500 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="text-sm font-medium text-[#6cc200] hover:underline cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Categories Carousel */}
      {!isLoading && !error && categories.length > 0 && (
        <div className="relative flex items-center">
          {/* Left Arrow */}
          <button
            onClick={() => scroll("left")}
            className="absolute -left-12 md:-left-16 z-10 size-10 bg-[#8cc629] hover:bg-[#7db424] text-white flex items-center justify-center rounded-full hover:scale-110 transition-transform drop-shadow-sm cursor-pointer"
          >
            <ArrowLeft className="size-5" />
          </button>

          <div
            ref={scrollRef}
            className="flex gap-4 md:gap-6 overflow-x-auto scrollbar-hide py-4 bg-white w-full max-w-[1100px] mx-auto justify-start md:justify-center"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {categories.map((category) => (
              <Link
                href={`/search?type=${encodeURIComponent(category.type)}`}
                key={category._id}
                className="flex-shrink-0 group cursor-pointer w-[160px] md:w-[180px] bg-white border border-gray-100 rounded-sm p-3 hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <div className="w-full h-[120px] md:h-[140px] rounded-xl overflow-hidden bg-[#f9f9f9] relative mb-3 flex items-center justify-center">
                  <Image
                    src={category.image || PLACEHOLDER_IMAGE}
                    alt={capitalizeWords(category.type)}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300 rounded-xl"
                  />
                </div>
                <div className="w-full bg-[#f0f9e0] rounded-sm py-2 px-3 flex items-center">
                  <p className="text-xs font-bold text-gray-800">
                    {capitalizeWords(category.type)}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="absolute -right-12 md:-right-16 z-10 size-10 bg-[#8cc629] hover:bg-[#7db424] text-white flex items-center justify-center rounded-full hover:scale-110 transition-transform drop-shadow-sm cursor-pointer"
          >
            <ArrowRight className="size-5" />
          </button>
        </div>
      )}
    </section>
  );
}
