"use client";

import { createContext, useContext, useState } from "react";
import { OrderDraftContextType, OrderDraftDataType } from "./types/order";

const OrderDraftContext = createContext<OrderDraftContextType | null>(null);

export default function OrderDraftContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [orderData, setOrderData] = useState<OrderDraftDataType | null>(null);
  const saveOrder = (data: OrderDraftDataType) => {
    setOrderData(data);
  };
  const clearOrder = () => {
    setOrderData(null);
  };
  return (
    <OrderDraftContext.Provider
      value={{ data: orderData, saveOrder, clearOrder }}
    >
      {children}
    </OrderDraftContext.Provider>
  );
}

export const useOrderDraft = () => {
  const context = useContext(OrderDraftContext);
  if (!context) {
    throw new Error("Component must be in a order draft context provider");
  }

  return context;
};
