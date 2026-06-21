/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import type { CartItem } from "@/types/cart";

interface ShoppingCartProps {
  cartItems: CartItem[];
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, delta: number) => void;
  onReturnToStore: () => void;
}

export default function ShoppingCart({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onReturnToStore,
}: ShoppingCartProps) {
  return (
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
                        onClick={() => onRemoveItem(item.id)}
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
                        <p className="text-sm font-semibold text-gray-800 mb-1">{item.name}</p>
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
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="px-3 py-1.5 hover:bg-gray-50 text-gray-600 transition-colors"
                      >
                        —
                      </button>
                      <span className="px-3 py-1.5 text-sm font-medium border-x border-gray-200 min-w-10 text-center">
                        {item.quantity.toString().padStart(2, "0")}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, 1)}
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
            onClick={onReturnToStore}
            className="text-[13px] font-bold text-[#8cc629] border border-[#8cc629] px-6 py-2.5 rounded-md hover:bg-[#f4faee] transition-colors w-full sm:w-auto uppercase tracking-wide"
          >
            Return to store
          </button>
        </div>
      </div>
    </div>
  );
}
