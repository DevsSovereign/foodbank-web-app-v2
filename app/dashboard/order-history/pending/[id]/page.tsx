"use client";

import { useSearchParams } from "next/navigation";
import OrderDetailView from "@/components/order-details/OrderDetailView";
import { useGetSingleOrderHistory } from "@/lib/queries";
import ErrorSection from "@/components/ui/ErrorSection";
import LoaderSection from "@/components/ui/Loader";

export default function PendingOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const {
    data: order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useGetSingleOrderHistory({ orderId: orderId as string });

  if (isOrderLoading) {
    return <LoaderSection />;
  }

  if (orderError || !order) {
    return <ErrorSection message="Failed to load order details. Please try again later." />;
  }

  return <OrderDetailView order={order} variant="pending" />;
}
