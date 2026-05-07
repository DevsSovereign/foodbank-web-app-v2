"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ApiError } from "@/types/api";
import { userService } from "@/lib/services/user.service";
import { useToast } from "@/components/ui/toast/ToastProvider";

export default function TrackDeliveryPage() {
  const [isTracking, setIsTracking] = useState<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>("");
  const router = useRouter();
  const { toast } = useToast();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!orderNumber.trim()) return;

    setIsTracking(true);

    try {
      const res = await userService.trackOrder({ orderNumber: orderNumber.trim() });
      router.push(`/dashboard/track-delivery/${orderNumber.trim()}?tracker=${JSON.stringify(res)}`);
    } catch (err) {
      if (err instanceof ApiError) {
        toast({ variant: "error", title: "Error", description: err.message });
      } else {
        toast({
          variant: "error",
          title: "Error",
          description: "Something went wrong. Please try again.",
        });
      }
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Track Delivery</h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-3xl">
          To track your order please enter your order ID in the input field below and press the
          &quot;Track Order&quot; button. Track your order in real time and stay updated on every
          step of your delivery.
        </p>
      </div>
      <form onSubmit={handleTrack} className="w-full">
        <div className="mb-6">
          <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-2">
            Enter Order Number
          </label>
          <input
            type="text"
            id="orderNumber"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="Enter Order Number"
            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#8cc629] focus:border-transparent transition-all placeholder:text-gray-400 text-sm"
          />
        </div>

        <button
          type="submit"
          disabled={!orderNumber.trim() || isTracking}
          className="bg-[#8cc629] hover:bg-[#7db424] disabled:opacity-50 disabled:cursor-not-allowed text-white px-12 py-3 rounded-lg font-bold text-sm transition-colors shadow-sm w-full md:w-auto"
        >
          {isTracking ? "Tracking..." : "Track Delivery"}
        </button>
      </form>
    </div>
  );
}
