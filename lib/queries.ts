"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "./services/user.service";
import { OrderHistoryStatus } from "@/types/user";

// queries keys
export const queryKeys = {
  getCustomer: "getCustomer",
  getOrderHistory: "getOrderHistory",
  getAllRepayment: "getAllRepayment",
  getNotifications: "getNotifications",
  getFAQs: "getFAQs",
};

// queries
export const useGetCustomer = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getCustomer],
    queryFn: async () => {
      return await userService.getCustomer();
    },
  });

  return queryResult;
};

export const useGetOrderHistory = ({
  status = "",
  limit,
}: {
  status: OrderHistoryStatus;
  limit?: number;
}) => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getOrderHistory, status],
    queryFn: async () => {
      return await userService.getOrderHistory({ status, limit });
    },
  });

  return queryResult;
};

export const useGetSingleOrderHistory = ({ orderId }: { orderId: string }) => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getOrderHistory, orderId],
    queryFn: async () => {
      return await userService.getSingleOrderHistory({ orderId });
    },
  });

  return queryResult;
};

export const useGetAllRepayment = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getAllRepayment],
    queryFn: async () => {
      return await userService.getAllRepayment();
    },
  });

  return queryResult;
};

export const useGetNotifications = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getNotifications],
    queryFn: async () => {
      return await userService.getNotifications();
    },
  });

  return queryResult;
};

export const useGetFAQs = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getFAQs],
    queryFn: async () => {
      return await userService.getFAQs();
    },
  });

  return queryResult;
};
