import {
  LiveOrderEvent,
  Order,
  OrderStaff,
  OrderStatus,
  Transaction,
} from "@/context/types/order";

// ─── Socket event payloads ───────────────────────────────────
export interface OrderStatusChangedPayload {
  orderId: string;
  orderNumber: string;
  status: OrderStatus;
  event: LiveOrderEvent;
  updatedAt: string;
}

export interface OrderAssignedPayload {
  orderId: string;
  orderNumber: string;
  staff: OrderStaff;
  event: LiveOrderEvent;
}

export interface NewOrderPayload {
  order: Order[];
}

export interface PaymentConfirmedPayload {
  orderId: string;
  orderNumber: string;
  transaction: Transaction;
}

export type UserOrdersResponsePayload = Order[];
