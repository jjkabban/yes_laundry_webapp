import {
  LiveOrderEvent,
  OrderStatus,
  OrderCustomer,
  OrderStaff,
  Order,
  OrderDraft,
  OrderDraftItemEntry,
} from "@/types/shared/order.type";
import { Transaction } from "@/types/shared/transaction.type";

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
  order: Order;
}

export interface PaymentConfirmedPayload {
  orderId: string;
  orderNumber: string;
  transaction: Transaction;
}

interface OrderDraftEditableFields {
  serviceId?: string | null;
  bagCount?: number | null;
  weightKg?: number | null;
  items?: OrderDraftItemEntry[] | null;
  pickupAddress?: string | null;
  pickupWindow?: string | null;
  deliveryAddress?: string | null;
  deliveryWindow?: string | null;
  currentStep?: string | null;
}

export type UpdateOrderDraftInputPayload = Partial<OrderDraftEditableFields>;
export type CreateOrderDraftPayload = UpdateOrderDraftInputPayload & {
  serviceId: string;
};

export type UserOrderResponsePayload = Order[];
export type UserDraftOrderResponsePayload = OrderDraft[];
