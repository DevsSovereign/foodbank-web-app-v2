"use client";

import { useQuery } from "@tanstack/react-query";
import { userService } from "./services/user.service";
import { OrderHistoryStatus } from "@/types/user";
import { cartService } from "./services/cart.service";
import { wishlistService } from "./services/wishlist.service";
import { productService } from "./services/product.service";
import { categoryService } from "./services/category.service";
import { getAuthToken } from "./auth-utils";

// queries keys
export const queryKeys = {
  getCustomer: "getCustomer",
  getOrderHistory: "getOrderHistory",
  getAllRepayment: "getAllRepayment",
  getNotifications: "getNotifications",
  getFAQs: "getFAQs",
  getCart: "getCart",
  getWishlist: "getWishlist",
  getProducts: "getProducts",
  getCategories: "getCategories",
  firstOrder: "firstOrder",
  allFees: "allFees",
};

// queries
export const useGetCustomer = () => {
  const token = getAuthToken();

  const queryResult = useQuery({
    queryKey: [queryKeys.getCustomer],
    queryFn: async () => {
      return await userService.getCustomer();
    },
    enabled: !!token,
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

export const useGetCartItems = () => {
  const token = getAuthToken();

  const queryResult = useQuery({
    queryKey: [queryKeys.getCart],
    queryFn: async () => {
      return await cartService.getCartItems();
    },
    enabled: !!token,
  });

  return queryResult;
};

export const useGetWishlistItems = () => {
  const token = getAuthToken();

  const queryResult = useQuery({
    queryKey: [queryKeys.getWishlist],
    queryFn: async () => {
      return await wishlistService.getWishlistItems();
    },
    enabled: !!token,
  });

  return queryResult;
};

export const useGetCategories = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getCategories],
    queryFn: async () => {
      return await categoryService.getCategories();
    },
  });

  return queryResult;
};

export const useGetProducts = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.getProducts],
    queryFn: async () => {
      return await productService.getProducts();
    },
  });

  return queryResult;
};

export const useCheckFirstOrder = ({ userId }: { userId: string }) => {
  const queryResult = useQuery({
    queryKey: [queryKeys.firstOrder],
    queryFn: async () => {
      return await cartService.checkFirstOrder({ userId });
    },
    enabled: !!userId,
  });

  return queryResult;
};

export const useGetAllFees = () => {
  const queryResult = useQuery({
    queryKey: [queryKeys.allFees],
    queryFn: async () => {
      return await cartService.getOrderPrices();
    },
  });

  return queryResult;
};
