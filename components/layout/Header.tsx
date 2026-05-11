"use client";

import { useMemo, useState } from "react";
import { Heart, User, ShoppingCart, Search, ClipboardList } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/lib/auth-utils";
import { useGetCartItems, useGetWishlistItems } from "@/lib/queries";
import { useToast } from "../ui/toast/ToastProvider";
import { handleError } from "@/lib/handle-error";

export default function Header() {
  const [query, setQuery] = useState<string>("");
  const { data: wishlistItems, error: wishlistItemsError } = useGetWishlistItems();
  const { data: cartItems, error: cartItemsError } = useGetCartItems();
  const router = useRouter();
  const isAuthenticated = !!getAuthToken();
  const { toast } = useToast();

  const wishlistCount = useMemo(() => wishlistItems?.data?.length ?? 0, [wishlistItems]);
  const cartCount = useMemo(() => cartItems?.data?.length ?? 0, [cartItems]);

  const submitSearch = () => {
    const q = query.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  if (cartItemsError) {
    toast({ variant: "error", title: handleError(cartItemsError, "Failed to fetch cart items.") });
  }
  if (wishlistItemsError) {
    toast({
      variant: "error",
      title: handleError(wishlistItemsError, "Failed to fetch wishlist items."),
    });
  }

  return (
    <header className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <Image
            src="/assets/app-logo.svg"
            alt="FoodBank Logo"
            width={180}
            height={45}
            className="object-contain"
          />
        </Link>

        <div className="flex-1 max-w-2xl mx-8 hidden lg:flex">
          <form
            className="relative w-full flex items-center"
            onSubmit={(e) => {
              e.preventDefault();
              submitSearch();
            }}
          >
            <Search className="absolute left-3 text-gray-400 size-4" />
            <input
              type="text"
              placeholder="Search what you need..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-[#6cc200]"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 bottom-0 bg-white border border-gray-200 px-3 py-2 rounded-r-md text-gray-400 hover:text-gray-600 transition"
              aria-label="Search"
            >
              <Search className="size-5 text-gray-400" />
            </button>
          </form>
        </div>

        <div className="flex items-center space-x-6 text-gray-400">
          <Link href="/wishlist" className="relative hover:text-[#6cc200] transition h-5 block">
            <Heart className="size-5" />
            <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold size-4 rounded-full flex items-center justify-center">
              {wishlistCount}
            </span>
          </Link>

          <div className="w-px h-5 bg-gray-200" />

          {/* User icon: authenticated → dashboard, unauthenticated → login */}
          <Link
            href={isAuthenticated ? "/dashboard" : "/login"}
            className="hover:text-[#6cc200] transition h-5 block"
          >
            <User className="size-5" />
          </Link>

          <div className="w-px h-5 bg-gray-200" />

          <Link href="/cart" className="relative hover:text-[#6cc200] transition h-5 block">
            <ShoppingCart className="size-5 text-gray-400 group-hover:text-[#6cc200]" />
            <span className="absolute -top-1.5 -right-2 bg-gray-100 border border-gray-200 text-gray-500 text-[9px] font-bold size-4 rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          </Link>

          <div className="w-px h-5 bg-gray-200" />

          <button className="hover:text-[#6cc200] transition">
            <ClipboardList className="size-5 text-[#6cc200]" />
          </button>
        </div>
      </div>
    </header>
  );
}
