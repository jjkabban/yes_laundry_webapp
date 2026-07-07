import { AddOn } from "./addOn";
import { ServicePriceModel, SlotName } from "./service";
import { Transaction } from "./transaction";

export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PICKED_UP"
  | "IN_PROGRESS"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "CANCELLED";

export type OrderEventType =
  | "CREATED"
  | "CONFIRMED"
  | "ASSIGNED"
  | "REASSIGNED"
  | "PICKED_UP"
  | "PROCESSING_STARTED"
  | "PROFESSIONAL_CLEANING"
  | "READY"
  | "OUT_FOR_DELIVERY"
  | "DELIVERED"
  | "PAYMENT_RECEIVED"
  | "CANCELLED"
  | "NOTE_ADDED";

export type RecurrenceFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export interface OrderServiceItem {
  id: string;
  unitPrice: number;
  item?: { name: string };
}

export interface OrderItem {
  id: string;
  orderId: string;
  serviceItemId: string;
  serviceItem?: OrderServiceItem;
  quantity: number;
  unitPriceAtOrder: number;
  notes?: string | null;
}

// ─── Add-ons ─────────────────────────────────────────────────

export interface OrderAddOn {
  id: string;
  orderId: string;
  serviceAddOnId: string;
  priceAtOrder: number;
  quantity: number;
  serviceAddOn?: {
    addOn?: Pick<AddOn, "name" | "description">;
  };
  createdAt: string;
  updatedAt: string;
}

export interface LiveOrderEvent {
  id: string;
  orderId: string;
  eventType: OrderEventType;
  status?: OrderStatus | null;
  workedOnById?: string;
  workedOnBy?: {
    id: string;
    firstName: string;
    lastName: string;
    profileImage?: string | null;
  };
  triggeredById?: string | null;
  triggeredBy?: {
    id: string;
    firstName: string;
    lastName: string;
  } | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  createdAt: string;
}

export interface OrderCustomer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  email?: string | null;
  profileImage?: string | null;
}

export interface OrderStaff {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string | null;
  profileImage?: string | null;
}

export interface OrderService {
  id: string;
  name: string;
  priceModel: ServicePriceModel;
  icon: string;
}

export interface Order {
  id: string;
  orderNumber: string;

  customerId: string;
  customer?: OrderCustomer;

  assignedStaffId?: string | null;
  assignedStaff?: OrderStaff | null;

  serviceId: string;
  service?: OrderService;

  status: OrderStatus;

  bagCount?: number | null;
  weightKg?: number | null;
  items: OrderItem[];
  timeSlot: SlotName;
  startTime: string;
  endTime: string;

  recurringOrderId?: string | null;

  pickupAddress: string;
  pickupWindow: string;
  pickedUpAt?: string | null;

  deliveryAddress: string;
  deliveryWindow?: string | null;
  deliveredAt?: string | null;

  subtotal: number;
  deliveryFee: number;
  discount: number;
  total: number;
  addOns?: OrderAddOn[];
  transactions?: Transaction[];
  events?: LiveOrderEvent[];

  createdAt: string;
  updatedAt: string;
}

export type UserOrderResponsePayload = Order[];

export interface OrderDraftAddOn {
  id: string;
  orderDraftId: string;
  serviceAddOnId: string;
  priceAtOrder: number;
  quantity: number;
  serviceAddOn?: {
    addOn?: Pick<AddOn, "name" | "description">;
  };
  createdAt: string;
}

export interface RecurringOrderAddOn {
  id: string;
  recurringOrderId: string;
  serviceAddOnId: string;
  priceAtOrder: number;
  quantity: number;
  serviceAddOn?: {
    addOn?: Pick<AddOn, "name" | "description">;
  };
  createdAt: string;
}

// ─── OrderDraft ──────────────────────────────────────────────
export interface OrderDraftItemEntry {
  serviceItemId: string;
  quantity: number;
  notes?: string | null;
}
export interface OrderDraft {
  id: string;

  customerId: string;
  customer?: OrderCustomer;

  serviceId?: string | null;
  service?: OrderService;

  bagCount?: number | null;
  weightKg?: number | null;
  items?: OrderDraftItemEntry[];

  addOns?: OrderDraftAddOn[];

  pickupAddress?: string | null;
  pickupWindow?: string | null;
  deliveryAddress?: string | null;
  deliveryWindow?: string | null;

  currentStep?: string | null;

  createdAt: string;
  updatedAt: string;
}

// ─── RecurringOrder ──────────────────────────────────────────
export interface RecurringOrder {
  id: string;

  customerId: string;
  customer?: OrderCustomer;

  serviceId: string;
  service?: OrderService;

  frequency: RecurrenceFrequency;
  dayOfWeek?: number | null; // 0–6, relevant for WEEKLY/BIWEEKLY
  dayOfMonth?: number | null; // 1–31, relevant for MONTHLY
  preferredTime: string;

  pickupAddress: string;
  deliveryAddress: string;

  addOns?: RecurringOrderAddOn[];

  isActive: boolean;
  nextRunAt: string;
  lastRunAt?: string | null;

  generatedOrders?: { id: string; orderNumber: string; status: string }[];

  createdAt: string;
  updatedAt: string;
}
