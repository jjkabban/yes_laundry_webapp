"use client";
import React, { createContext, useContext, useState } from "react";
import { OrderContextType } from "./types/order";
import useOrders from "@/hooks/useOrders";

const OrderContext = createContext<OrderContextType | null>(null);

export default function OrderContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOrdersLoading, orders: orderData, error } = useOrders();
  return (
    <OrderContext.Provider value={{ orderData, isOrdersLoading, error }}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error("component must be in order context");

  return context;
};
