import {
  OrderHistoryStatus,
  SingleOrderHistory,
  TrackOrderResponse,
  UserOrderHistory,
  UserRepaymentHistory,
  UserResponse,
  UserNotificationsResponse,
} from "@/types/user";
import { apiClient } from "../api-client";

export const userService = {
  getCustomer(): Promise<{ customer: UserResponse }> {
    return apiClient.get<{ customer: UserResponse }>("/getCustomer");
  },

  getOrderHistory({
    status,
    limit,
  }: {
    status: OrderHistoryStatus;
    limit?: number;
  }): Promise<UserOrderHistory> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (limit) params.append("limit", limit.toString());

    return apiClient.get<UserOrderHistory>(`/users/shopping-history?${params.toString()}`);
  },

  getAllRepayment(): Promise<UserRepaymentHistory> {
    return apiClient.get<UserRepaymentHistory>("/getAllRepaymentHistoryForCustomer");
  },

  getSingleOrderHistory({ orderId }: { orderId: string }): Promise<SingleOrderHistory> {
    return apiClient.get<SingleOrderHistory>(`/getSingleOrder/${orderId}`);
  },

  trackOrder({
    orderNumber,
  }: {
    orderNumber: string;
  }): Promise<{ order: TrackOrderResponse; message: string }> {
    return apiClient.get<{ order: TrackOrderResponse; message: string }>(
      `/trackOrder/${orderNumber}`,
    );
  },

  getNotifications(): Promise<UserNotificationsResponse[]> {
    return apiClient.get<UserNotificationsResponse[]>(`/getCustomerNotifications`);
  },

  getFAQs(): Promise<{ faqs: [] }> {
    return apiClient.get<{ faqs: [] }>(`/getFaqs`);
  },
};
