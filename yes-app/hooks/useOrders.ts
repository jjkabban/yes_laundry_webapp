import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/context/SocketContext";
import { getUserOrders } from "@/lib/api/order.api";
import {
  NewOrderPayload,
  OrderStatusChangedPayload,
} from "@/lib/api/type/order.type";
import { Order } from "@/types/shared/order.type";

const ORDERS_KEY = ["orders"];
const ACTIVE_STATUSES: Order["status"][] = [
  "PENDING",
  "CONFIRMED",
  "PICKED_UP",
  "IN_PROGRESS",
  "READY",
  "OUT_FOR_DELIVERY",
];

async function fetchOrders(): Promise<Order[]> {
  const res = await getUserOrders();
  if (!res.success || !res.data) throw new Error("Failed to load orders");
  return res.data;
}

export default function useOrders() {
  const queryClient = useQueryClient();
  const { socket } = useSocket();

  const {
    data: orders,
    isLoading: isOrdersLoading,
    error,
  } = useQuery({
    queryKey: ORDERS_KEY,
    queryFn: fetchOrders,
    refetchInterval: (query) => {
      const hasActiveOrder = query.state.data?.some((o) =>
        ACTIVE_STATUSES.includes(o.status),
      );
      return hasActiveOrder ? 15_000 : false;
    },
  });

  useEffect(() => {
    if (!socket) return;

    const handleNewOrder = (payload: NewOrderPayload) => {
      queryClient.setQueryData<Order[]>(ORDERS_KEY, (prev) => [
        payload.order,
        ...(prev ?? []),
      ]);
    };

    const handleStatusChanged = (payload: OrderStatusChangedPayload) => {
      queryClient.setQueryData<Order[]>(
        ORDERS_KEY,
        (prev) =>
          prev?.map((o) =>
            o.id === payload.orderId
              ? { ...o, status: payload.status, updatedAt: payload.updatedAt }
              : o,
          ) ?? prev,
      );
    };

    socket.on("order:new", handleNewOrder);
    socket.on("order:status_changed", handleStatusChanged);

    return () => {
      socket.off("order:new", handleNewOrder);
      socket.off("order:status_changed", handleStatusChanged);
    };
  }, [socket, queryClient]);

  return {
    isOrdersLoading,
    error: error ? "Failed to load orders" : null,
    orders: orders ?? null,
  };
}
