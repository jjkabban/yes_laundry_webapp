import { useSocket } from "@/context/SocketContext";
import { useToast } from "@/context/ToastContext";
import { Order } from "@/context/types/order";
import { getUserOrders } from "@/lib/api/order.api";
import {
  NewOrderPayload,
  OrderStatusChangedPayload,
} from "@/lib/api/type/order.type";
import { useEffect, useState } from "react";

export default function useOrders() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [isOrdersLoading, setIsOrdersLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { socket } = useSocket();
  const { showToast } = useToast();

  const fetchOrders = async (isBackground = false) => {
    try {
      if (!isBackground) setIsOrdersLoading(true);
      const res = await getUserOrders();
      if (res.success && res.data) {
        setOrders(res.data);
        setError(null);
      }
    } catch (err) {
      if (!isBackground) {
        setError("Failed to load orders");
      } else {
        showToast("Couldn't refresh orders", "warning");
      }
    } finally {
      if (!isBackground) setIsOrdersLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(false);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => fetchOrders(true), 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("order:new", (payload: NewOrderPayload) => {
      setOrders((prev) => [...payload.order, ...(prev ?? [])]);
    });
    socket.on("order:status_changed", (payload: OrderStatusChangedPayload) => {
      setOrders(
        (prev) =>
          prev?.map((o) =>
            o.id === payload.orderId
              ? { ...o, status: payload.status, updatedAt: payload.updatedAt }
              : o,
          ) ?? null,
      );
    });

    return () => {
      socket.off("order:new");
      socket.off("order:status_changed");
      socket.off("payment:confirmed");
    };
  }, [socket]);

  return { isOrdersLoading, error, orders };
}
