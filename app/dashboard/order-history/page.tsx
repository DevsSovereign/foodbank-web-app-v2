"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import { useGetOrderHistory } from "@/lib/queries";
import DataTable from "@/components/ui/DataTable";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import { HistoryData, OrderHistoryStatus } from "@/types/user";
import EmptyState from "@/components/ui/EmptyState";
import { formatDate } from "@/functions/formatDate";

type StatusStyleKey = Exclude<OrderHistoryStatus, "">;

const STATUS_STYLES: Record<StatusStyleKey, string> = {
  "All Orders": "text-gray-500",
  inProgress: "text-orange-500",
  pending: "text-orange-500",
  completed: "text-[#8cc629]",
  cancelled: "text-red-500",
};

const columnHelper = createColumnHelper<HistoryData>();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const columns: ColumnDef<HistoryData, any>[] = [
  columnHelper.accessor("orderNumber", {
    header: "Order ID",
    cell: (info) => <span className="font-medium text-gray-900">{info.getValue() as string}</span>,
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const status = info.getValue() as StatusStyleKey;
      return <span className={`font-medium ${STATUS_STYLES[status]}`}>{status}</span>;
    },
  }),
  columnHelper.accessor("orderDate", {
    header: "Date",
    cell: (info) => <span className="text-gray-500">{formatDate(info.getValue() as string)}</span>,
  }),
  columnHelper.display({
    id: "action",
    header: "Action",
    meta: { align: "right" },
    cell: ({ row }) => {
      const { _id, status } = row.original;
      const href =
        status === "completed"
          ? `/dashboard/order-history/completed/${_id}`
          : status === "cancelled"
            ? `/dashboard/order-history/cancelled/${_id}`
            : `/dashboard/order-history/pending/${_id}`;

      return (
        <Link
          href={{ pathname: href, query: { orderId: _id } }}
          className="inline-flex items-center gap-1 text-xs font-medium text-[#8cc629] hover:underline"
        >
          View Details <ArrowRight size={12} />
        </Link>
      );
    },
  }),
];

const TABS: OrderHistoryStatus[] = ["All Orders", "inProgress", "completed", "cancelled"] as const;

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState<OrderHistoryStatus>("All Orders");

  const {
    data: orders,
    isLoading: orderHistoryLoading,
    error: orderHistoryError,
  } = useGetOrderHistory({
    status: activeTab === "All Orders" ? "" : activeTab,
  });

  const filteredOrders = orders
    ? activeTab === "All Orders"
      ? orders.data
      : orders.data.filter((order) => {
          if (activeTab === "inProgress") {
            return order.status === "pending";
          }

          return order.status === activeTab;
        })
    : [];

  if (orderHistoryError) {
    return <ErrorSection message={handleError(orderHistoryError)} />;
  }

  return (
    <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header & Tabs */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <h1 className="text-sm font-bold text-gray-800 tracking-wider">ORDER HISTORY</h1>

          <div className="flex gap-6 overflow-x-auto pb-2 sm:pb-0">
            {TABS.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-xs font-medium capitalize whitespace-nowrap transition-colors relative pb-1 ${
                  activeTab === tab ? "text-[#8cc629]" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab}
                {activeTab === tab && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8cc629]" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={filteredOrders}
          isLoading={orderHistoryLoading}
          emptyMessage="No order history found"
        />
      </div>

      {/* Mobile Card List */}
      <div className="md:hidden">
        {filteredOrders.length < 1 ? (
          <EmptyState message="No order history found" />
        ) : (
          filteredOrders.map((order, index) => (
            <div key={index} className="p-4 border-b border-gray-100 last:border-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-sm font-bold text-gray-900">Order FBD-263764</h3>
                <span className="text-[10px] text-gray-500">{formatDate(order.orderDate)}</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Order ID - {order._id}</p>

              <div className="flex justify-between items-center">
                <span
                  className={`text-sm font-medium capitalize ${STATUS_STYLES[order.status as StatusStyleKey] || "text-gray-500"}`}
                >
                  {order.status}
                </span>

                <Link
                  href={{
                    pathname:
                      order.status === "completed"
                        ? `/dashboard/order-history/completed/${order._id}`
                        : order.status === "cancelled"
                          ? `/dashboard/order-history/cancelled/${order._id}`
                          : `/dashboard/order-history/pending/${order._id}`,
                    query: { orderId: order._id },
                  }}
                  className="px-4 py-1.5 rounded border border-[#8cc629] text-[#8cc629] text-xs font-medium hover:bg-[#8cc629] hover:text-white transition-colors"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
