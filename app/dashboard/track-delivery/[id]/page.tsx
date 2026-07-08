"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Star } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { TrackOrderResponse } from "@/types/user";
import { useSupportChat } from "@/hooks/useSupportChat";
import { formatDate, formatDateOnly, formatTimeOnly } from "@/functions/formatDate";

const STEPS = [
  { label: "Order Approved", image: "/assets/approved.svg", alt: "Approved" },
  { label: "On its way", image: "/assets/on-its-way.png", alt: "On its way" },
  { label: "Order is here", image: "/assets/order-here.svg", alt: "Order is here" },
  { label: "Delivered", image: "/assets/delivered.png", alt: "Delivered" },
] as const;

// Maps order status → index of the last completed step (0-based, -1 = cancelled)
const STATUS_TO_STEP: Record<string, number> = {
  pending: 0,
  inProgress: 1,
  outForDelivery: 1,
  completed: 3,
  cancelled: -1,
};

const BANNER_BG: Record<string, string> = {
  pending: "bg-orange-500",
  inProgress: "bg-[#2a9d5c]",
  outForDelivery: "bg-[#2a9d5c]",
  completed: "bg-[#8cc629]",
  cancelled: "bg-red-500",
};

// Desktop green connector widths per currentStep (0–3)
const DESKTOP_PROGRESS = ["w-[12%]", "w-[38%]", "w-[62%]", "w-full"] as const;

// Mobile green dashed line heights per currentStep (0–3)
const MOBILE_PROGRESS = ["h-[10%]", "h-[35%]", "h-[65%]", "h-full"] as const;

export default function TrackDeliveryDetailsPage() {
  const [isRateModalOpen, setIsRateModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { open: openSupport, isLoggedIn } = useSupportChat();

  const { order, message } = JSON.parse(useSearchParams().get("tracker") ?? "{}") as {
    order: TrackOrderResponse;
    message: string;
  };

  const status = order?.status ?? "";
  const currentStep = STATUS_TO_STEP[status] ?? 0;
  const isCancelled = currentStep === -1;
  const bannerBg = BANNER_BG[status] ?? "bg-[#2a9d5c]";
  const desktopProgress = isCancelled ? "w-0" : (DESKTOP_PROGRESS[currentStep] ?? "w-0");
  const mobileProgress = isCancelled ? "h-0" : (MOBILE_PROGRESS[currentStep] ?? "h-0");

  const handlePublishReview = () => {
    setIsRateModalOpen(false);
    setRating(0);
    setFeedback("");
  };

  // Date/time to display under each step — step 0 uses orderDate, rest use updatedAt
  const stepTimestamp = (stepIndex: number): { date: string; time: string } | null => {
    if (isCancelled || stepIndex > currentStep) return null;
    const iso = stepIndex === 0 ? (order?.orderDate ?? order?.createdAt) : order?.updatedAt;
    if (!iso) return null;
    return { date: formatDateOnly(iso), time: formatTimeOnly(iso) };
  };

  return (
    <div className="w-full">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Track Delivery</h1>
      </div>

      {/* Back */}
      <Link
        href="/dashboard/track-delivery"
        className="flex items-center gap-2 w-full border border-gray-200 rounded-lg p-3.5 mb-6 hover:bg-gray-50 transition-colors bg-white"
      >
        <ArrowLeft className="size-4 text-gray-500" />
        <span className="text-gray-500 font-medium text-xs tracking-wide">TRACK DELIVERY</span>
      </Link>

      {/* Status Banner */}
      <div className={`${bannerBg} rounded-lg p-5 mb-8 text-white shadow-sm`}>
        <h2 className="text-lg font-bold mb-1">
          {message || (isCancelled ? "Order Cancelled" : "Your order is being processed")}
        </h2>
        <p className="text-white/80 text-sm">
          Order placed · {formatDate(order?.orderDate ?? order?.createdAt)}
        </p>
      </div>

      {/* Delivery Code — desktop */}
      <div className="hidden sm:flex items-center gap-6 mb-12">
        <p className="text-gray-700 font-medium text-sm leading-snug">
          Share the delivery code with
          <br />
          the rider to confirm receipt.
        </p>
        <div className="flex gap-2">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="size-9 border border-gray-200 rounded-md flex items-center justify-center bg-white shadow-sm"
            >
              <span className="text-gray-700 font-bold text-lg leading-none">*</span>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Timeline */}
      <div className="relative mb-14 px-2 sm:px-8">
        {/* Desktop connector */}
        <div className="hidden sm:block absolute top-4 left-[12%] right-[12%] h-0.5 bg-gray-200 -z-10" />
        <div
          className={`hidden sm:block absolute top-4 left-[12%] ${desktopProgress} h-0.5 bg-[#8cc629] -z-10 transition-all duration-500`}
        />

        {/* Mobile vertical connector — fixed: no conflicting bg utility */}
        <div className="sm:hidden absolute top-4 bottom-4 left-6.5 w-0 border-l-2 border-dashed border-gray-200 -z-10" />
        <div
          className={`sm:hidden absolute top-4 left-6.5 ${mobileProgress} w-0 border-l-2 border-dashed border-[#8cc629] -z-10 transition-all duration-500`}
        />

        <div className="flex flex-col sm:flex-row justify-between relative z-10 gap-8 sm:gap-0">
          {STEPS.map((step, i) => {
            const isActive = !isCancelled && i <= currentStep;
            const isCurrent = !isCancelled && i === currentStep;
            const ts = stepTimestamp(i);

            const iconCircle = isCurrent
              ? "bg-[#8cc629] border-0"
              : isActive
                ? "bg-white border-[3px] border-[#8cc629]"
                : "bg-white border-2 border-gray-200";

            const imgClass = isCurrent
              ? "size-5 brightness-0 invert"
              : isActive
                ? "size-5"
                : "size-5 opacity-40";

            const labelClass = isActive ? "text-[#2a9d5c] font-bold" : "text-gray-400 font-medium";

            return (
              <div
                key={step.label}
                className="flex flex-row sm:flex-col items-start sm:items-center w-full sm:w-1/4 gap-4 sm:gap-0"
              >
                {/* Icon circle — single element, responsive via Tailwind */}
                <div
                  className={`size-10 rounded-full ${iconCircle} flex items-center justify-center sm:mb-2.5 shadow-sm shrink-0 mt-1 sm:mt-0`}
                >
                  <Image
                    src={step.image}
                    alt={step.alt}
                    width={20}
                    height={20}
                    className={imgClass}
                  />
                </div>

                {/* Text block */}
                <div className="text-left sm:text-center flex-1">
                  <div className="flex justify-between sm:block items-start pt-1 sm:pt-0">
                    <div>
                      <p className={`${labelClass} text-sm sm:text-xs mb-0.5`}>{step.label}</p>
                      {ts && (
                        <p className="text-gray-400 text-xs sm:hidden">
                          {ts.date} · {ts.time}
                        </p>
                      )}
                    </div>
                    {ts && <p className="text-gray-400 text-xs mt-1 sm:hidden">{ts.time}</p>}
                  </div>

                  {/* Desktop date lines */}
                  {ts ? (
                    <>
                      <p className="text-gray-400 text-[11px] hidden sm:block">{ts.date}</p>
                      <p className="text-gray-400 text-[11px] hidden sm:block">{ts.time}</p>
                    </>
                  ) : (
                    <p className="text-gray-300 text-[11px] hidden sm:block">—</p>
                  )}

                  {/* Mobile delivery code prompt on "Order is here" step */}
                  {i === 2 && (
                    <div className="mt-3 sm:hidden">
                      <p className="text-gray-400 text-xs mb-2">
                        Share the delivery code with the rider to confirm receipt.
                      </p>
                      <div className="flex gap-2">
                        {[0, 1, 2, 3].map((j) => (
                          <div
                            key={j}
                            className="size-6 border border-gray-200 rounded flex items-center justify-center bg-white"
                          >
                            <span className="text-gray-400 font-bold text-sm leading-none">*</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        {isLoggedIn && (
          <button
            onClick={openSupport}
            className="flex-1 bg-[#8cc629] hover:bg-[#7ab824] text-white font-bold py-3.5 px-6 rounded-lg transition-colors shadow-sm text-sm"
          >
            Contact Support
          </button>
        )}
        {order.status === "completed" && (
          <button
            onClick={() => setIsRateModalOpen(true)}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-3.5 px-6 rounded-lg transition-colors text-sm"
          >
            Rate Rider
          </button>
        )}
      </div>

      {/* Rate Rider Modal */}
      {isRateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wide">
                Rate Rider
              </h3>
            </div>

            <div className="p-6">
              <div className="flex justify-center gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`size-10 ${
                        star <= (hoveredRating || rating)
                          ? "fill-[#FFB800] text-[#FFB800]"
                          : "fill-transparent text-gray-800 stroke-[1.5]"
                      }`}
                    />
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-500 text-xs mb-6 px-4">
                5 stars is the highest rating. Your feedback helps us improve our delivery service.
              </p>

              <div className="mb-6">
                <label className="block text-xs font-medium text-gray-700 mb-2">Feedback</label>
                <textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Share your experience (optional)"
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-[#8cc629] focus:border-[#8cc629] resize-none h-28 placeholder:text-gray-400"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handlePublishReview}
                  disabled={rating === 0}
                  className="flex-1 bg-[#8cc629] hover:bg-[#7ab824] disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-lg transition-colors text-xs tracking-wide uppercase"
                >
                  Publish Review
                </button>
                <button
                  onClick={() => {
                    setIsRateModalOpen(false);
                    setRating(0);
                    setFeedback("");
                  }}
                  className="flex-1 bg-[#a3a3a3] hover:bg-gray-500 text-white font-bold py-3 rounded-lg transition-colors text-xs tracking-wide uppercase"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
