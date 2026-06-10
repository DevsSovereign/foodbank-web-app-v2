"use client";

import { ReactNode, useEffect } from "react";
import { useGetCustomer, useGetUserGamification } from "@/lib/queries";
import { useUserStore } from "@/store/useUserStore";

const CustomerDataProvider = ({ children }: { children: ReactNode }) => {
  const { user, setUser, setUserEligibles } = useUserStore();

  // fetch user details on root layout
  const { data: customerData } = useGetCustomer();
  const { data: gamification } = useGetUserGamification();

  // update user state
  useEffect(() => {
    if (user || !customerData) return;
    setUser(customerData.customer);
  }, [user, customerData, setUser]);

  // update user eligibles
  useEffect(() => {
    if (!gamification) return;
    setUserEligibles(gamification);
  }, [gamification, setUserEligibles]);

  return children;
};

export default CustomerDataProvider;
