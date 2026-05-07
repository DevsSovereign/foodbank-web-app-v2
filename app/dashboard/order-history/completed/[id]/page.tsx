"use client";

import { useSearchParams } from "next/navigation";
import { Loader } from "lucide-react";
import { useGetSingleOrderHistory } from "@/lib/queries";
import OrderDetailView from "@/components/order-details/OrderDetailView";
import ErrorSection from "@/components/ui/ErrorSection";

export default function CompletedOrderPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const {
    data: order,
    isLoading,
    error,
  } = useGetSingleOrderHistory({ orderId: orderId as string });

  if (isLoading) return <Loader className="size-5 animate-spin m-4" />;
  if (error || !order)
    return <ErrorSection message="Failed to load order details. Please try again later." />;

  return <OrderDetailView order={order} variant="completed" />;
}
