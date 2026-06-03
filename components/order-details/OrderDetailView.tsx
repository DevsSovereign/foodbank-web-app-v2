/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Check, Clock, Phone, Mail } from "lucide-react";
import { SingleOrderHistory } from "@/types/user";
import { formatDate } from "@/functions/formatDate";
import { formatCurrency } from "@/functions/formatCurrency";

export type OrderDetailVariant = "pending" | "completed" | "cancelled";

interface Props {
  order: SingleOrderHistory;
  variant: OrderDetailVariant;
}

const HEADER_TITLE: Record<OrderDetailVariant, string> = {
  pending: "ORDER DETAILS - PENDING ORDER",
  completed: "ORDER DETAILS - COMPLETE",
  cancelled: "ORDER DETAILS - CANCELLED",
};

const STATUS_LABEL: Record<OrderDetailVariant, string> = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

interface AccentConfig {
  text: string;
  bg: string;
  border: string;
  mobileLine: string;
  progressWidth: string;
  destinationFilled: boolean;
  destinationLabel: string;
  destinationLabelClass: string;
}

const ACCENT: Record<OrderDetailVariant, AccentConfig> = {
  pending: {
    text: "text-orange-500",
    bg: "bg-orange-500",
    border: "border-orange-500",
    mobileLine: "border-orange-200",
    progressWidth: "w-1/2",
    destinationFilled: false,
    destinationLabel: "Pending",
    destinationLabelClass: "text-orange-500",
  },
  completed: {
    text: "text-[#8cc629]",
    bg: "bg-[#8cc629]",
    border: "border-[#8cc629]",
    mobileLine: "border-[#8cc629]",
    progressWidth: "w-full",
    destinationFilled: true,
    destinationLabel: "",
    destinationLabelClass: "text-gray-400",
  },
  cancelled: {
    text: "text-red-500",
    bg: "bg-red-500",
    border: "border-red-500",
    mobileLine: "border-red-500",
    progressWidth: "w-full",
    destinationFilled: false,
    destinationLabel: "Cancelled",
    destinationLabelClass: "text-red-500",
  },
};

export default function OrderDetailView({ order, variant }: Props) {
  const accent = ACCENT[variant];
  const items = order?.orderItems ?? [];
  const discount = order?.discount ?? 0;

  const itemsTotal = items.reduce(
    (accumulator, currentValue) => accumulator + currentValue.totalPrice,
    0,
  );

  const total = itemsTotal + (order?.deliveryFee ?? 0) + (order?.serviceFee ?? 0) - discount;

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center gap-4">
        <Link
          href="/dashboard/order-history"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-sm font-bold text-gray-800 tracking-wider uppercase">
          {HEADER_TITLE[variant]}
        </h1>
      </div>

      <div className="p-6 md:p-8">
        {/* Status Banner */}
        <div className="bg-gray-50 rounded-lg p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h2 className="text-lg font-bold text-gray-800 uppercase">
              Order Type - {order?.orderType ? order.orderType.replace(/_/g, " ") : "—"}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Status -{" "}
              <span className={`font-medium capitalize ${accent.text}`}>
                {order?.status ?? "—"}
              </span>
            </p>
          </div>
          <span className={`text-xl font-bold ${accent.text}`}>{STATUS_LABEL[variant]}</span>
        </div>

        {/* Order List */}
        <div className="mb-12">
          <h3 className="text-base font-bold text-gray-800 mb-6">Order List</h3>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400 py-6">No items found.</p>
            ) : (
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-xs text-gray-500 font-medium uppercase tracking-wider border-b border-gray-100">
                    <th className="px-4 py-3 pl-0">Products</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Quantity</th>
                    <th className="px-4 py-3 text-right pr-0">Sub Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {items.map((item) => {
                    const unitPrice =
                      (item?.quantity ?? 0) > 0
                        ? (item?.totalPrice ?? 0) / item.quantity
                        : (item?.totalPrice ?? 0);

                    return (
                      <tr key={item?._id}>
                        <td className="py-6 pl-0">
                          <div className="flex items-center gap-4">
                            <div className="size-16 bg-gray-100 rounded-md overflow-hidden shrink-0">
                              {item?.image ? (
                                <img
                                  src={item.image}
                                  alt={item?.name ?? "Product"}
                                  className="size-full object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div className="size-full bg-gray-200" />
                              )}
                            </div>
                            <div>
                              <p className={`text-sm font-bold ${accent.text}`}>
                                {item?.name ?? "—"}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {item?.type ?? "—"} - {item?.measurement ?? "—"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-6 text-sm font-medium text-gray-900">
                          {formatCurrency(unitPrice)}
                        </td>
                        <td className="px-4 py-6 text-sm text-gray-500">x{item?.quantity ?? 0}</td>
                        <td className="px-4 py-6 text-sm font-bold text-gray-900 text-right pr-0">
                          {formatCurrency(item?.totalPrice)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-6">
            {items.length === 0 ? (
              <p className="text-sm text-gray-400">No items found.</p>
            ) : (
              items.map((item, i) => (
                <React.Fragment key={item?._id ?? i}>
                  {i > 0 && <div className="border-b border-gray-100" />}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="size-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                        {item?.image ? (
                          <img
                            src={item.image}
                            alt={item?.name ?? "Product"}
                            className="size-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="size-full bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item?.name ?? "—"}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {item?.type ?? "—"} | {item?.measurement ?? "—"}
                        </p>
                      </div>
                    </div>
                    <p className={`text-sm font-bold ${accent.text}`}>
                      {formatCurrency(item?.totalPrice)}
                    </p>
                  </div>
                </React.Fragment>
              ))
            )}
          </div>
        </div>

        {/* Order Process Timeline */}
        <div className="mb-12">
          <h3 className="text-base font-bold text-gray-800 mb-8">Order Process</h3>

          {/* Desktop Timeline */}
          <div className="hidden md:block relative px-4 md:px-12 py-8">
            {/* Track */}
            <div className="absolute top-11.5 left-0 right-0 h-1.5 bg-gray-100 z-0 mx-12 md:mx-20">
              <div className={`h-full ${accent.progressWidth} ${accent.bg} rounded-full`} />
            </div>

            <div className="relative z-10 flex justify-between items-start">
              {/* Store node */}
              <div className="flex flex-col items-center text-center gap-3">
                <div
                  className={`size-8 rounded-full ${accent.bg} flex items-center justify-center text-white shadow-sm border-4 border-white mb-2 relative z-10 ring-4 ring-white`}
                >
                  <Check size={14} strokeWidth={3} />
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className={`size-8 flex items-center justify-center ${accent.text} mb-1`}>
                    <MapPin size={24} strokeWidth={2} />
                  </div>
                  <p className="text-xs font-bold text-gray-800">Store</p>
                  <p className="text-[10px] text-gray-400">{formatDate(order?.orderDate)}</p>
                </div>
              </div>

              {/* Destination node */}
              <div className="flex flex-col items-center text-center gap-3">
                {accent.destinationFilled ? (
                  <div
                    className={`size-8 rounded-full ${accent.bg} flex items-center justify-center text-white shadow-sm border-4 border-white mb-2 relative z-10 ring-4 ring-white`}
                  >
                    <Check size={14} strokeWidth={3} />
                  </div>
                ) : (
                  <div
                    className={`size-8 rounded-full bg-white border-2 ${accent.border} shadow-sm mb-2 relative z-10 ring-4 ring-white`}
                  />
                )}
                <div className="flex flex-col items-center gap-1">
                  <div className={`size-8 flex items-center justify-center ${accent.text} mb-1`}>
                    <MapPin size={24} strokeWidth={2} />
                  </div>
                  <p className="text-xs font-medium text-gray-500 max-w-50">
                    {order?.deliveryDetails ?? "—"}
                  </p>
                  <p className={`text-[10px] font-medium ${accent.destinationLabelClass}`}>
                    {accent.destinationLabel || formatDate(order?.orderDate)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Timeline */}
          <div className="md:hidden relative pl-4 py-4">
            <div
              className={`absolute top-4 bottom-12 left-6.75 w-0.5 border-l-2 border-dashed ${accent.mobileLine} z-0`}
            />
            <div className="space-y-10 relative z-10">
              <div className="flex items-start gap-4">
                <div className={`size-6 flex items-center justify-center ${accent.text}`}>
                  <MapPin size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">Store</p>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <Clock size={14} />
                    <span>{formatDate(order?.orderDate)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className={`size-6 flex items-center justify-center ${accent.text}`}>
                  <MapPin size={20} strokeWidth={2} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 leading-snug mb-1">
                    {order?.deliveryDetails ?? "—"}
                  </p>
                  <div className={`flex items-center gap-2 text-xs font-medium ${accent.text}`}>
                    <Clock size={14} />
                    <span className="capitalize">
                      {accent.destinationLabel || formatDate(order?.orderDate)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rider Details */}
        {order?.riderId && (
          <div className="mb-12">
            <h3 className="text-base font-bold text-gray-800 mb-6">Delivery Rider</h3>
            <div className="flex items-center gap-5 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <div className="size-14 rounded-full bg-gray-200 overflow-hidden shrink-0">
                {order.riderId.image ? (
                  <img
                    src={order.riderId.image}
                    alt={`${order.riderId.firstName} ${order.riderId.lastName}`}
                    className="size-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div
                    className={`size-full flex items-center justify-center text-white text-sm font-bold ${accent.bg}`}
                  >
                    {order.riderId.firstName?.[0]}
                    {order.riderId.lastName?.[0]}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900">
                  {order.riderId.firstName} {order.riderId.lastName}
                </p>
                <p className="text-xs text-gray-400 mb-3">Delivery Rider</p>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
                  <a
                    href={`tel:${order.riderId.phoneNumber}`}
                    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Phone size={13} className="shrink-0 text-gray-400" />
                    {order.riderId.phoneNumber}
                  </a>
                  <a
                    href={`mailto:${order.riderId.email}`}
                    className="inline-flex items-center gap-2 text-xs text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <Mail size={13} className="shrink-0 text-gray-400" />
                    {order.riderId.email}
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Summary & Promo Section */}
        <div className={discount > 0 ? "grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16" : ""}>
          {discount > 0 && (
            <div className="order-1 lg:order-2">
              <h3 className="text-base font-bold text-gray-800 mb-6">Promo Code</h3>
              <div className="bg-[#f0f7e6] border border-gray-100 rounded-lg p-1 mb-2">
                <input
                  type="text"
                  value="Applied"
                  readOnly
                  className="w-full px-4 py-3 text-sm text-gray-500 bg-transparent outline-none"
                />
              </div>
              <p className="text-xs text-[#8cc629] font-medium">
                *{formatCurrency(discount)} discount applied
              </p>
            </div>
          )}

          <div className={discount > 0 ? "order-2 lg:order-1" : ""}>
            <h3 className="text-base font-bold text-gray-800 mb-6">Order Summary</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Item Total</span>
                <span className="font-medium text-gray-900">{formatCurrency(itemsTotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery Charge</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(order?.deliveryFee)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Service Charge</span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(order?.serviceFee)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Discount</span>
                  <span className="font-medium text-[#8cc629]">-{formatCurrency(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-4 border-t border-gray-100">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(total)}</span>
              </div>
            </div>

            {variant === "pending" && (
              <Link
                href="/dashboard/track-delivery"
                className="w-full bg-[#8cc629] hover:bg-[#7db424] text-white py-4 rounded-lg font-bold text-sm transition-colors shadow-sm flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                Track Order <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
