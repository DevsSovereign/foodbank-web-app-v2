"use client";

import { ReactNode, useEffect } from "react";
import { useGetCustomer } from "@/lib/queries";
import { useUserStore } from "@/store/useUserStore";

const CustomerDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser } = useUserStore();

  // fetch user details on root layout
  const { data: customerData } = useGetCustomer();

  // update user state
  useEffect(() => {
    if (user || !customerData) return;

    setUser(customerData.customer);
  }, [user, customerData, setUser]);

  return children;
};

export default CustomerDataProvider;
