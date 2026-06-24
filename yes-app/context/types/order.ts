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

export type PaymentStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "PARTIALLY_REFUNDED";

export type PaymentMethod = "CARD" | "MOBILE_MONEY" | "CASH";

export type RecurrenceFrequency = "WEEKLY" | "BIWEEKLY" | "MONTHLY";

export type PriceModel = "PER_BAG" | "BY_WEIGHT" | "PER_ITEM";

// ─── Sub-types ───────────────────────────────────────────────

export interface ServiceItem {
  id: string;
  name: string;
  price: number;
}

export interface OrderItem {
  id: string;
  orderId: string;
  serviceItemId: string;
  serviceItem?: ServiceItem;
  quantity: number;
  unitPriceAtOrder: number;
  notes?: string | null;
}

export interface Transaction {
  id: string;
  orderId: string;
  amount: number;
  status: PaymentStatus;
  method: PaymentMethod;
  reference?: string | null;
  failureReason?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface LiveOrderEvent {
  id: string;
  orderId: string;
  eventType: OrderEventType;
  status?: OrderStatus | null;
  workedOnById: string;
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
  priceModel: PriceModel;
}

// ─── Draft ───────────────────────────────────────────────────

export interface OrderDraft {
  id: string;
  customerId: string;
  serviceId?: string | null;
  bagCount?: number | null;
  weightKg?: number | null;
  items?: Record<string, unknown> | null;
  pickupAddress?: string | null;
  pickupWindow?: string | null;
  deliveryAddress?: string | null;
  deliveryWindow?: string | null;
  currentStep?: string | null;
  createdAt: string;
  updatedAt: string;
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

  // relations — only present when explicitly fetched
  transactions?: Transaction[];
  events?: LiveOrderEvent[];

  createdAt: string;
  updatedAt: string;
}

export interface OrdersContextType {
  orders: Order[] | null;
  isOrdersLoading: boolean;
  error: string | null;
  // refetch: () => Promise<void>;
}

export interface LiveOrderEvent {
  id: string;
  orderId: string;
  eventType: OrderEventType;
  status?: OrderStatus | null;
  notes?: string | null;
  createdAt: string;
}
