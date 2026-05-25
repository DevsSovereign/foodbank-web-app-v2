"use client";

import { useState, useRef, useEffect } from "react";
import { AlignLeft, ChevronDown } from "lucide-react";
import { categoryService } from "@/lib/services/category.service";
import type { CategoryDto } from "@/types/category";
import { useRouter } from "next/navigation";

/** Capitalise each word, e.g. "frozen foods" → "Frozen Foods". */
function capitalizeWords(str: string): string {
  return str
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export default function CategoryDropdown({
  triggerStyle = "navbar",
}: {
  triggerStyle?: "navbar" | "pageNav";
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categories, setCategories] = useState<CategoryDto[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function fetchCategories() {
      try {
        setIsLoading(true);
        const response = await categoryService.getCategories();
        if (cancelled) return;
        setCategories(response.data ?? []);
        if (!selectedCategory && response.data?.[0]?.type) {
          setSelectedCategory(response.data[0].type);
        }
      } catch {
        if (!cancelled) setCategories([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    fetchCategories();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {triggerStyle === "navbar" ? (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition whitespace-nowrap"
        >
          <AlignLeft className="size-3.5" />
          All Category
          <ChevronDown
            className={`size-3 ml-1 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
      ) : (
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className="flex items-center justify-between w-full md:w-auto md:gap-1.5 bg-white border border-gray-100 text-gray-600 px-3 py-1.5 rounded-md text-xs font-medium hover:bg-gray-100 transition shadow-sm"
        >
          <span className="flex items-center gap-2 md:gap-1.5">
            <span className="md:hidden flex items-center justify-center p-0.5">
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
            </span>
            <span className="text-gray-800">All Category</span>
          </span>
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
            className={`transition-transform md:ml-1 ${isOpen ? "rotate-180" : ""}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </button>
      )}

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-60 bg-white border border-gray-100 rounded-md shadow-xl z-50 py-5 px-6 max-h-100 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <h2 className="text-xs font-bold text-[#1a2b49] mb-4 uppercase tracking-wide">
            Categories
          </h2>
          <ul className="space-y-4">
            {isLoading ? (
              <li className="text-[13px] text-gray-400">Loading…</li>
            ) : categories.length < 1 ? (
              <li className="text-[13px] text-gray-400">No categories found.</li>
            ) : (
              categories.map((cat) => {
                const isSelected = selectedCategory === cat.type;

                return (
                  <li
                    key={cat._id}
                    className="flex items-center gap-3 cursor-pointer group"
                    onClick={() => {
                      setSelectedCategory(cat.type);
                      setIsOpen(false);
                      router.push(`/search?type=${encodeURIComponent(cat.type)}`);
                    }}
                  >
                    <div
                      className={`size-4.5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? "border-[#70c400]" : "border-gray-200 group-hover:border-[#70c400]"}`}
                    >
                      {isSelected && <div className="size-2.5 rounded-full bg-[#70c400]" />}
                    </div>
                    <span
                      className={`text-[13px] ${isSelected ? "font-bold text-[#1a2b49]" : "text-gray-500 group-hover:text-gray-800"} transition-colors whitespace-nowrap`}
                    >
                      {capitalizeWords(cat.type)}
                    </span>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
