import {
  Order,
  OrderDraft,
  OrderDraftItemEntry,
} from "@/types/shared/order.type";

const ORDERS: Order[] = [
  {
    id: "clx9k2m3n0002abc123def456",
    orderNumber: "YL-002",
    timeSlot: "MORNING",
    startTime: "10:00AM",
    endTime: "11:00AM",
    customerId: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
    customer: {
      id: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
      firstName: "Justice",
      lastName: "Abban",
      email: "abbanjustice134@gmail.com",
      phoneNumber: "0241234567",
      profileImage: null,
    },

    assignedStaffId: "clx9k2m3n0003staff789",
    assignedStaff: {
      id: "clx9k2m3n0003staff789",
      firstName: "Kwame",
      lastName: "Mensah",
      phoneNumber: "0551234567",
      profileImage: null,
    },

    serviceId: "clx9k2m3n0004service",
    service: {
      id: "clx9k2m3n0004service",
      name: "Standard Wash",
      priceModel: "PER_ITEM",
    },

    status: "CANCELLED",

    bagCount: null,
    weightKg: null,
    items: [
      {
        id: "clx9k2m3n0005item1",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0006si1",
        serviceItem: {
          id: "clx9k2m3n0006si1",
          unitPrice: 5.0,
          item: { name: "Shirt" },
        },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
      {
        id: "clx9k2m3n0007item2",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: {
          id: "clx9k2m3n0008si2",
          unitPrice: 8.0,
          item: { name: "Trousers" },
        },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
      {
        id: "clx9k2m3n0009item3",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0010si3",
        serviceItem: {
          id: "clx9k2m3n0010si3",
          unitPrice: 12.0,
          item: { name: "Bedsheet" },
        },
        quantity: 1,
        unitPriceAtOrder: 12.0,
        notes: null,
      },
    ],

    recurringOrderId: null,

    pickupAddress: "14 Spintex Road, Accra",
    pickupWindow: "2026-06-24T09:00:00.000Z",
    pickedUpAt: "2026-06-24T09:20:00.000Z",

    deliveryAddress: "14 Spintex Road, Accra",
    deliveryWindow: "2026-06-25T17:00:00.000Z",
    deliveredAt: null,

    subtotal: 43.0,
    deliveryFee: 5.0,
    discount: 0.0,
    total: 48.0,

    transactions: [
      {
        id: "clx9k2m3n0011tx1",
        orderId: "clx9k2m3n0002abc123def456",
        amount: 48.0,
        status: "REFUNDED",
        method: "MOBILE_MONEY",
        provider: "MTN",
        reference: "MM-20260624-00123",
        failureReason: null,
        createdAt: "2026-06-24T08:55:00.000Z",
        updatedAt: "2026-06-24T08:55:00.000Z",
      },
    ],

    events: [
      {
        id: "clx9k2m3n0012ev1",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CREATED",
        status: "PENDING",
        notes: null,
        createdAt: "2026-06-24T08:55:00.000Z",
        workedOnById: "clx9k2m3n0003staff789",
      },
      {
        id: "clx9k2m3n0013ev2",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CONFIRMED",
        status: "CONFIRMED",
        notes: null,
        createdAt: "2026-06-24T09:00:00.000Z",
        workedOnById: "clx9k2m3n0003staff789",
      },
      {
        id: "clx9k2m3n0014ev3",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PICKED_UP",
        status: "PICKED_UP",
        notes: "Items collected from customer",
        createdAt: "2026-06-24T09:20:00.000Z",
        workedOnById: "clx9k2m3n0003staff789",
      },
      {
        id: "clx9k2m3n0015ev4",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CANCELLED", // ✅ was PROCESSING_STARTED, contradicted status below
        status: "CANCELLED",
        notes: "Customer requested cancellation",
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "clx9k2m3n0003staff789",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },

  {
    id: "clx9k2m3n0020abc123def457",
    orderNumber: "YL-003",
    timeSlot: "MORNING",
    startTime: "10:00AM",
    endTime: "11:00AM",
    customerId: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
    customer: {
      id: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
      firstName: "Justice",
      lastName: "Abban",
      email: "abbanjustice134@gmail.com",
      phoneNumber: "0241234567",
      profileImage: null,
    },

    assignedStaffId: "clx9k2m3n0003staff789",
    assignedStaff: {
      id: "clx9k2m3n0003staff789",
      firstName: "Kwame",
      lastName: "Mensah",
      phoneNumber: "0551234567",
      profileImage: null,
    },

    serviceId: "clx9k2m3n0004service",
    service: {
      id: "clx9k2m3n0004service",
      name: "Standard Wash",
      priceModel: "PER_ITEM",
    },

    status: "READY",

    bagCount: null,
    weightKg: null,
    items: [
      {
        id: "clx9k2m3n0021item1",
        orderId: "clx9k2m3n0020abc123def457",
        serviceItemId: "clx9k2m3n0006si1",
        serviceItem: {
          id: "clx9k2m3n0006si1",
          unitPrice: 5.0,
          item: { name: "Shirt" },
        },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
    ],

    recurringOrderId: null,

    pickupAddress: "14 Spintex Road, Accra",
    pickupWindow: "2026-06-24T09:00:00.000Z",
    pickedUpAt: "2026-06-24T09:20:00.000Z",

    deliveryAddress: "14 Spintex Road, Accra",
    deliveryWindow: "2026-06-25T17:00:00.000Z",
    deliveredAt: null,

    subtotal: 15.0,
    deliveryFee: 5.0,
    discount: 0.0,
    total: 20.0,

    transactions: [
      {
        id: "clx9k2m3n0022tx1",
        orderId: "clx9k2m3n0020abc123def457",
        amount: 20.0,
        status: "PAID",
        method: "MOBILE_MONEY",
        provider: "MTN",
        reference: "MM-20260624-00124",
        failureReason: null,
        createdAt: "2026-06-24T08:55:00.000Z",
        updatedAt: "2026-06-24T08:55:00.000Z",
      },
    ],

    events: [
      {
        id: "clx9k2m3n0023ev1",
        orderId: "clx9k2m3n0020abc123def457",
        eventType: "READY",
        status: "READY",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "clx9k2m3n0003staff789",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },

  {
    id: "clx9k2m3n0030abc123def458",
    orderNumber: "YL-004",
    timeSlot: "MORNING",
    startTime: "10:00AM",
    endTime: "11:00AM",
    customerId: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
    customer: {
      id: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
      firstName: "Justice",
      lastName: "Abban",
      email: "abbanjustice134@gmail.com",
      phoneNumber: "0241234567",
      profileImage: null,
    },

    assignedStaffId: "clx9k2m3n0003staff789",
    assignedStaff: {
      id: "clx9k2m3n0003staff789",
      firstName: "Kwame",
      lastName: "Mensah",
      phoneNumber: "0551234567",
      profileImage: null,
    },

    serviceId: "clx9k2m3n0004service",
    service: {
      id: "clx9k2m3n0004service",
      name: "Standard Wash",
      priceModel: "PER_ITEM",
    },

    status: "IN_PROGRESS",

    bagCount: null,
    weightKg: null,
    items: [
      {
        id: "clx9k2m3n0031item1",
        orderId: "clx9k2m3n0030abc123def458",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: {
          id: "clx9k2m3n0008si2",
          unitPrice: 8.0,
          item: { name: "Trousers" },
        },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
    ],

    recurringOrderId: null,

    pickupAddress: "14 Spintex Road, Accra",
    pickupWindow: "2026-06-24T09:00:00.000Z",
    pickedUpAt: "2026-06-24T09:20:00.000Z",

    deliveryAddress: "14 Spintex Road, Accra",
    deliveryWindow: "2026-06-25T17:00:00.000Z",
    deliveredAt: null,

    subtotal: 16.0,
    deliveryFee: 5.0,
    discount: 0.0,
    total: 21.0,

    transactions: [
      {
        id: "clx9k2m3n0032tx1",
        orderId: "clx9k2m3n0030abc123def458",
        amount: 21.0,
        status: "PENDING",
        method: "MOBILE_MONEY",
        provider: "MTN",
        reference: "MM-20260624-00125",
        failureReason: null,
        createdAt: "2026-06-24T08:55:00.000Z",
        updatedAt: "2026-06-24T08:55:00.000Z",
      },
    ],

    events: [
      {
        id: "clx9k2m3n0033ev1",
        orderId: "clx9k2m3n0030abc123def458",
        eventType: "PROCESSING_STARTED",
        status: "IN_PROGRESS",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "clx9k2m3n0003staff789",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },
];

const ORDER_DRAFTS: OrderDraft[] = [
  {
    id: "draft_001",
    customerId: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
    serviceId: "clx9k2m3n0004service",
    bagCount: 2,
    weightKg: null,
    items: null,
    pickupAddress: "14 Spintex Road, Accra",
    pickupWindow: null,
    deliveryAddress: null,
    deliveryWindow: null,
    currentStep: "2",
    createdAt: "2026-06-23T10:00:00.000Z",
    updatedAt: "2026-06-23T10:45:00.000Z",
  },
  {
    id: "draft_002",
    customerId: "d179a4cc-b611-4793-a065-bb2fadc12e4d",
    serviceId: "clx9k2m3n0005service",
    bagCount: null,
    weightKg: null,
    // ✅ was a keyed object with name/unitPrice baked in — now a plain
    // array of { serviceItemId, quantity, notes }, matching what's
    // actually stored in the Json column. name/unitPrice get resolved
    // live from ServiceItem when the draft is read, never stored here.
    items: [
      { serviceItemId: "clx9k2m3n0006si1", quantity: 3, notes: null },
      { serviceItemId: "clx9k2m3n0008si2", quantity: 2, notes: null },
    ] satisfies OrderDraftItemEntry[],
    pickupAddress: "East Legon, Accra",
    pickupWindow: "2026-06-25T09:00:00.000Z",
    deliveryAddress: null,
    deliveryWindow: null,
    currentStep: "3",
    createdAt: "2026-06-22T08:00:00.000Z",
    updatedAt: "2026-06-24T07:30:00.000Z",
  },
];

export { ORDERS, ORDER_DRAFTS };
