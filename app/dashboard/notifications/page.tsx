"use client";

import React, { useState } from "react";
import { FileText } from "lucide-react";
import { useGetNotifications } from "@/lib/queries";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import LoaderSection from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<"Today" | "Yesterday">("Today");
  const {
    data: allNotifications,
    isLoading: isNotificationsLoading,
    isRefetching: isNotificationsRefetching,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useGetNotifications();

  console.log(allNotifications);

  const notifications = [
    {
      id: 1,
      title: "Late Pickup Policy",
      description:
        "Kindly receive your order within 10 minutes of the rider's arrival to avoid a fine of ₦500 charge.",
      time: "3:45 PM",
      date: "Today",
    },
    {
      id: 2,
      title: "Order Created",
      description: "Order FBD-263764 created",
      time: "3:45 PM",
      date: "Today",
    },
    {
      id: 3,
      title: "Order Created",
      description: "Order FBD-263764 created",
      time: "3:45 PM",
      date: "Today",
    },
    {
      id: 4,
      title: "Order Created",
      description: "Order FBD-263764 created",
      time: "3:45 PM",
      date: "Today",
    },
  ];

  if (notificationsError) {
    return (
      <ErrorSection message={handleError(notificationsError)} onRetry={refetchNotifications} />
    );
  }

  return (
    <div className="w-full max-w-4xl">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-500 text-sm">Latest platform activities</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 sm:border-none">
          {["Today", "Yesterday"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as "Today" | "Yesterday")}
              className={`pb-2 sm:pb-0 text-sm font-medium transition-colors relative ${
                activeTab === tab ? "text-[#8cc629]" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#8cc629] sm:hidden"></span>
              )}
              {activeTab === tab && (
                <span className="hidden sm:block absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#8cc629]"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {isNotificationsLoading || isNotificationsRefetching ? (
          <LoaderSection />
        ) : !allNotifications ? (
          <EmptyState message="No available notification" />
        ) : (
          notifications.map((notification) => (
            <div
              key={notification.id}
              className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-50 hover:border-gray-100 transition-colors shadow-sm"
            >
              <div className="shrink-0 size-10 rounded-full bg-[#f0f7e6] flex items-center justify-center text-[#8cc629]">
                <FileText size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold text-gray-900">{notification.title}</h3>
                  <span className="text-xs text-gray-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  {notification.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
