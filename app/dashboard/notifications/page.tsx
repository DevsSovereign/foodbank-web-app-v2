"use client";

import React, { useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { useGetNotifications } from "@/lib/queries";
import ErrorSection from "@/components/ui/ErrorSection";
import { handleError } from "@/lib/handle-error";
import LoaderSection from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import { NotificationItem } from "@/types/user";

type Tab = "Today" | "Yesterday" | "Previous";
const TABS: Tab[] = ["Today", "Yesterday", "Previous"];

function NotificationCard({ message }: NotificationItem) {
  return (
    <div className="flex items-start gap-4 p-4 bg-white rounded-xl border border-gray-50 hover:border-gray-100 transition-colors shadow-sm">
      <div className="shrink-0 size-10 rounded-full bg-[#f0f7e6] flex items-center justify-center text-[#8cc629]">
        <FileText size={20} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-bold text-gray-900">{message.title}</h3>
          <span className="text-xs text-gray-400 whitespace-nowrap">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1 leading-relaxed">{message.body}</p>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Today");
  const {
    data: allNotifications,
    isLoading: isNotificationsLoading,
    error: notificationsError,
    refetch: refetchNotifications,
  } = useGetNotifications();

  // Response is grouped by date string keys (e.g. "Fri Feb 27 2026").
  // Match keys against today/yesterday by actual calendar date; everything
  // else falls under "Previous".
  const todayKey = new Date().toDateString();
  const yesterdayKey = (() => {
    const date = new Date();
    date.setDate(date.getDate() - 1);
    return date.toDateString();
  })();

  const todayItems = allNotifications?.[todayKey] ?? [];
  const yesterdayItems = allNotifications?.[yesterdayKey] ?? [];
  const previousGroups = useMemo(
    () =>
      Object.keys(allNotifications ?? {})
        .filter((date) => date !== todayKey && date !== yesterdayKey)
        .sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
        .map((date) => ({ date, items: allNotifications?.[date] ?? [] })),
    [allNotifications, todayKey, yesterdayKey]
  );

  if (notificationsError) {
    return (
      <ErrorSection message={handleError(notificationsError)} onRetry={refetchNotifications} />
    );
  }

  const hasContent =
    activeTab === "Today"
      ? todayItems.length > 0
      : activeTab === "Yesterday"
        ? yesterdayItems.length > 0
        : previousGroups.length > 0;

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
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
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
        {isNotificationsLoading ? (
          <LoaderSection />
        ) : !hasContent ? (
          <EmptyState message={`No notifications for ${activeTab.toLowerCase()}`} />
        ) : activeTab === "Today" ? (
          todayItems.map((item) => <NotificationCard key={item.message._id} {...item} />)
        ) : activeTab === "Yesterday" ? (
          yesterdayItems.map((item) => <NotificationCard key={item.message._id} {...item} />)
        ) : (
          previousGroups.map(({ date, items }) => (
            <div key={date} className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                {date}
              </h2>
              {items.map((item) => (
                <NotificationCard key={item.message._id} {...item} />
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
