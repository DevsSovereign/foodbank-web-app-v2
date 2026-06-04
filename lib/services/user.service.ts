import {
  OrderHistoryStatus,
  SingleOrderHistory,
  TrackOrderResponse,
  UserOrderHistory,
  UserRepaymentHistory,
  UserResponse,
  UserNotificationsResponse,
  UpdateProfilePayload,
  TransactionHistoryResponse,
} from "@/types/user";
import { apiClient } from "../api-client";

export const userService = {
  async getCustomer(): Promise<{ customer: UserResponse }> {
    return await apiClient.get<{ customer: UserResponse }>("/getCustomer");
  },

  async getOrderHistory({
    status,
    limit,
  }: {
    status: OrderHistoryStatus;
    limit?: number;
  }): Promise<UserOrderHistory> {
    const params = new URLSearchParams();
    if (status) params.append("status", status);
    if (limit) params.append("limit", limit.toString());

    return await apiClient.get<UserOrderHistory>(`/users/shopping-history?${params.toString()}`);
  },

  async getAllRepayment(): Promise<UserRepaymentHistory> {
    return await apiClient.get<UserRepaymentHistory>("/getAllRepaymentHistoryForCustomer");
  },

  async getSingleOrderHistory({ orderId }: { orderId: string }): Promise<SingleOrderHistory> {
    return await apiClient.get<SingleOrderHistory>(`/getSingleOrder/${orderId}`);
  },

  async trackOrder({
    orderNumber,
  }: {
    orderNumber: string;
  }): Promise<{ order: TrackOrderResponse; message: string }> {
    return await apiClient.get<{ order: TrackOrderResponse; message: string }>(
      `/trackOrder/${orderNumber}`,
    );
  },

  async getNotifications(): Promise<UserNotificationsResponse> {
    return await apiClient.get<UserNotificationsResponse>(`/getCustomerNotifications`);
  },

  async getFAQs(): Promise<{ faqs: [] }> {
    return await apiClient.get<{ faqs: [] }>(`/getFaqs`);
  },

  async updateProfile(payload: UpdateProfilePayload) {
    return await apiClient.put<{ message: string }>("/editProfileInfo", payload);
  },

  async getAccountOfficer() {
    const response = await apiClient.get<{
      data: { staff: Pick<UserResponse, "email" | "firstName" | "lastName" | "phoneNumber"> };
    }>(`/account-officer-staff/customer`);
    return response.data.staff;
  },

  async getUserTransactions() {
    return await apiClient.get<TransactionHistoryResponse>(
      `/users/transaction-history/transactions?limit=5`,
    );
  },
};
