"use client";

import React, { createContext, useContext, useState } from "react";
import { OrdersContextType } from "./types/order";
import useOrders from "@/hooks/useOrders";

const OrderContext = createContext<OrdersContextType | null>(null);

export default function OrderContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOrdersLoading, orders, error } = useOrders();
  return (
    <OrderContext.Provider value={{ orders, isOrdersLoading, error }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("component must be in order context");

  return context;
};
