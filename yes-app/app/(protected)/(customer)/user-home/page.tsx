"use client";
import Icon from "@/components/icons/LucideIcons";
import { motion } from "framer-motion";
import { useState } from "react";
import { usePanel } from "@/context/DashboardContext";
import OrderStepper from "@/components/ui/OrdersStepper";
import {
  LiveOrderPreview,
  PromotionList,
  RecentDraftOrders,
} from "@/components/components";
import { useOrderContext } from "@/context/OrderContext";
import { Order, OrderDraft } from "@/context/types/order";
import ServiceList from "@/components/components/ServiceList";
import { Service } from "@/context/types/service";
import { Promotion } from "@/context/types/promotions";
import { ReferralCard } from "@/components/ui";

// order of page and feeds to fetch
// tab, active orders(order status, progress), sechdule cta, service cards, promo/offer card, recent orders
// how it works strip , loyalty points, referral points

const mockOrder: Order[] = [
  {
    id: "clx9k2m3n0002abc123def456",
    orderNumber: "YL-002",

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
        serviceItem: { id: "clx9k2m3n0006si1", name: "Shirt", price: 5.0 },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
      {
        id: "clx9k2m3n0007item2",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: { id: "clx9k2m3n0008si2", name: "Trousers", price: 8.0 },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
      {
        id: "clx9k2m3n0009item3",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0010si3",
        serviceItem: { id: "clx9k2m3n0010si3", name: "Bedsheet", price: 12.0 },
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
        status: "PENDING",
        method: "MOBILE_MONEY",
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
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0013ev2",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CONFIRMED",
        status: "CONFIRMED",
        notes: null,
        createdAt: "2026-06-24T09:00:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0014ev3",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PICKED_UP",
        status: "PICKED_UP",
        notes: "Items collected from customer",
        createdAt: "2026-06-24T09:20:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0015ev4",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PROCESSING_STARTED",
        status: "IN_PROGRESS",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },
  {
    id: "clx9k2m3n0002abc123def456",
    orderNumber: "YL-002",

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
        id: "clx9k2m3n0005item1",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0006si1",
        serviceItem: { id: "clx9k2m3n0006si1", name: "Shirt", price: 5.0 },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
      {
        id: "clx9k2m3n0007item2",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: { id: "clx9k2m3n0008si2", name: "Trousers", price: 8.0 },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
      {
        id: "clx9k2m3n0009item3",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0010si3",
        serviceItem: { id: "clx9k2m3n0010si3", name: "Bedsheet", price: 12.0 },
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
        status: "PENDING",
        method: "MOBILE_MONEY",
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
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0013ev2",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CONFIRMED",
        status: "CONFIRMED",
        notes: null,
        createdAt: "2026-06-24T09:00:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0014ev3",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PICKED_UP",
        status: "PICKED_UP",
        notes: "Items collected from customer",
        createdAt: "2026-06-24T09:20:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0015ev4",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PROCESSING_STARTED",
        status: "IN_PROGRESS",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },
  {
    id: "clx9k2m3n0002abc123def456",
    orderNumber: "YL-002",

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
        id: "clx9k2m3n0005item1",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0006si1",
        serviceItem: { id: "clx9k2m3n0006si1", name: "Shirt", price: 5.0 },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
      {
        id: "clx9k2m3n0007item2",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: { id: "clx9k2m3n0008si2", name: "Trousers", price: 8.0 },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
      {
        id: "clx9k2m3n0009item3",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0010si3",
        serviceItem: { id: "clx9k2m3n0010si3", name: "Bedsheet", price: 12.0 },
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
        status: "PENDING",
        method: "MOBILE_MONEY",
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
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0013ev2",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CONFIRMED",
        status: "CONFIRMED",
        notes: null,
        createdAt: "2026-06-24T09:00:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0014ev3",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PICKED_UP",
        status: "PICKED_UP",
        notes: "Items collected from customer",
        createdAt: "2026-06-24T09:20:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0015ev4",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PROCESSING_STARTED",
        status: "IN_PROGRESS",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },
  {
    id: "clx9k2m3n0002abc123def456",
    orderNumber: "YL-002",

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
        id: "clx9k2m3n0005item1",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0006si1",
        serviceItem: { id: "clx9k2m3n0006si1", name: "Shirt", price: 5.0 },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
      {
        id: "clx9k2m3n0007item2",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: { id: "clx9k2m3n0008si2", name: "Trousers", price: 8.0 },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
      {
        id: "clx9k2m3n0009item3",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0010si3",
        serviceItem: { id: "clx9k2m3n0010si3", name: "Bedsheet", price: 12.0 },
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
        status: "PENDING",
        method: "MOBILE_MONEY",
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
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0013ev2",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CONFIRMED",
        status: "CONFIRMED",
        notes: null,
        createdAt: "2026-06-24T09:00:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0014ev3",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PICKED_UP",
        status: "PICKED_UP",
        notes: "Items collected from customer",
        createdAt: "2026-06-24T09:20:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0015ev4",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PROCESSING_STARTED",
        status: "IN_PROGRESS",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },
  {
    id: "clx9k2m3n0002abc123def456",
    orderNumber: "YL-002",

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
        id: "clx9k2m3n0005item1",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0006si1",
        serviceItem: { id: "clx9k2m3n0006si1", name: "Shirt", price: 5.0 },
        quantity: 3,
        unitPriceAtOrder: 5.0,
        notes: null,
      },
      {
        id: "clx9k2m3n0007item2",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0008si2",
        serviceItem: { id: "clx9k2m3n0008si2", name: "Trousers", price: 8.0 },
        quantity: 2,
        unitPriceAtOrder: 8.0,
        notes: "Handle with care",
      },
      {
        id: "clx9k2m3n0009item3",
        orderId: "clx9k2m3n0002abc123def456",
        serviceItemId: "clx9k2m3n0010si3",
        serviceItem: { id: "clx9k2m3n0010si3", name: "Bedsheet", price: 12.0 },
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
        status: "PENDING",
        method: "MOBILE_MONEY",
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
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0013ev2",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "CONFIRMED",
        status: "CONFIRMED",
        notes: null,
        createdAt: "2026-06-24T09:00:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0014ev3",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PICKED_UP",
        status: "PICKED_UP",
        notes: "Items collected from customer",
        createdAt: "2026-06-24T09:20:00.000Z",
        workedOnById: "",
      },
      {
        id: "clx9k2m3n0015ev4",
        orderId: "clx9k2m3n0002abc123def456",
        eventType: "PROCESSING_STARTED",
        status: "IN_PROGRESS",
        notes: null,
        createdAt: "2026-06-24T11:00:00.000Z",
        workedOnById: "",
      },
    ],

    createdAt: "2026-06-24T08:55:00.000Z",
    updatedAt: "2026-06-24T11:00:00.000Z",
  },
];

const mockDrafts: OrderDraft[] = [
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
    items: {
      clx9k2m3n0006si1: { name: "Shirt", quantity: 3, unitPrice: 5.0 },
      clx9k2m3n0008si2: { name: "Trousers", quantity: 2, unitPrice: 8.0 },
    },
    pickupAddress: "East Legon, Accra",
    pickupWindow: "2026-06-25T09:00:00.000Z",
    deliveryAddress: null,
    deliveryWindow: null,
    currentStep: "3",
    createdAt: "2026-06-22T08:00:00.000Z",
    updatedAt: "2026-06-24T07:30:00.000Z",
  },
];

export const SERVICES: Service[] = [
  {
    id: "svc_stain_removal",
    title: "Stain Removal",
    description:
      "Professional treatment for tough stains — oil, wine, ink, and more. Each item is assessed and treated individually before washing.",
    contextDescription: "Tough stains removed with expert care.",
    coverImage: "/images/services/stain-removal.jpg",
    turnaroundTime: "2 days",
    basePrice: 25,
    priceModel: "PER_ITEM",
    isActive: true,
    icon: "stain-removal",
  },
  {
    id: "svc_dry_cleaning",
    title: "Dry Cleaning",
    description:
      "Solvent-based cleaning for delicate fabrics — suits, dresses, silk, and wool that can't be machine washed.",
    contextDescription: "Premium care for delicate garments.",
    coverImage: "/images/services/dry-cleaning.jpg",
    turnaroundTime: "3 days",
    basePrice: 55,
    priceModel: "PER_ITEM",
    isActive: true,
    icon: "dry-cleaning",
  },
  {
    id: "svc_ironing",
    title: "Ironing / Pressing",
    description:
      "Crisp, wrinkle-free results for everyday wear and formal items. Garments are steamed and pressed to a professional finish.",
    contextDescription: "Perfectly pressed and wrinkle-free.",
    coverImage: "/images/services/ironing.jpg",
    turnaroundTime: "Next day",
    basePrice: 15,
    priceModel: "PER_ITEM",
    isActive: true,
    icon: "ironing",
  },
  {
    id: "svc_personal_laundry",
    title: "Personal Laundry",
    description:
      "Wash, dry, and fold service for everyday clothing. Sorted by colour, washed at the right temperature, and neatly folded.",
    contextDescription: "Fresh, clean clothes without the hassle.",
    coverImage: "/images/services/personal-laundry.jpg",
    turnaroundTime: "Next day",
    basePrice: 8,
    priceModel: "BY_WEIGHT",
    isActive: true,
    icon: "personal-laundry",
  },
  {
    id: "svc_commercial_laundry",
    title: "Commercial Laundry",
    description:
      "Bulk laundry for businesses — hotels, restaurants, salons, and offices. High-volume washing with consistent quality and fast turnaround.",
    contextDescription: "Reliable laundry solutions for businesses.",
    coverImage: "/images/services/commercial-laundry.jpg",
    turnaroundTime: "2 days",
    basePrice: 120,
    priceModel: "PER_BAG",
    isActive: true,
    icon: "commercial-laundry",
  },
  {
    id: "svc_stain_removal",
    title: "Stain Removal",
    description:
      "Professional treatment for tough stains — oil, wine, ink, and more. Each item is assessed and treated individually before washing.",
    contextDescription: "Tough stains removed with expert care.",
    coverImage: "/images/services/stain-removal.jpg",
    turnaroundTime: "2 days",
    basePrice: 25,
    priceModel: "PER_ITEM",
    isActive: true,
    icon: "stain-removal",
  },
];

export const PROMOTIONS: Promotion[] = [
  {
    id: "promo_first_order",
    campaignName: "First Order Discount",
    description: "Enjoy 15% off your first laundry order.",
    discountType: "PERCENTAGE",
    discountValue: 15,
    minOrderValue: 0,
    startsAt: new Date("2026-01-01"),
    expiresAt: new Date("2026-12-31"),
    isActive: true,
  },
  {
    id: "promo_free_pickup",
    campaignName: "Free Pickup & Delivery",
    description: "Get free pickup and delivery on all orders this week.",
    discountType: "FIXED_AMOUNT",
    discountValue: 20,
    minOrderValue: 80,
    startsAt: new Date("2026-06-20"),
    expiresAt: new Date("2026-06-30"),
    isActive: true,
  },
  {
    id: "promo_weekend_special",
    campaignName: "Weekend Laundry Deal",
    description: "Save 10% on all laundry orders during weekends.",
    discountType: "PERCENTAGE",
    discountValue: 10,
    minOrderValue: 50,
    startsAt: new Date("2026-06-01"),
    expiresAt: new Date("2026-08-31"),
    isActive: true,
  },
  {
    id: "promo_dry_cleaning",
    campaignName: "Dry Cleaning Special",
    description: "Enjoy 20% off all dry cleaning services.",
    discountType: "PERCENTAGE",
    discountValue: 20,
    minOrderValue: 100,
    startsAt: new Date("2026-06-10"),
    expiresAt: new Date("2026-07-10"),
    isActive: true,
  },
  {
    id: "promo_loyalty_reward",
    campaignName: "Loyalty Reward",
    description: "Get GH₵10 off your next order as a returning customer.",
    discountType: "FIXED_AMOUNT",
    discountValue: 10,
    minOrderValue: 60,
    startsAt: new Date("2026-01-01"),
    isActive: true,
  },
  {
    id: "promo_express_service",
    campaignName: "Express Care",
    description: "Fast-track your laundry with priority handling.",
    discountType: "PERCENTAGE",
    discountValue: 5,
    minOrderValue: 120,
    startsAt: new Date("2026-06-01"),
    expiresAt: new Date("2026-09-01"),
    isActive: true,
  },
];

export default function CustomerHomePage() {
  const [pickupAddress, setPickupAddress] = useState("East legon, Accra");
  const [services, setServices] = useState<Service[]>(SERVICES);
  const [promotions, setPromotions] = useState<Promotion[]>(PROMOTIONS);
  const [recentOrders, setRecentOrders] = useState<OrderDraft[]>([]);
  const [draftOrders, setDraftOrders] = useState<OrderDraft[]>(mockDrafts);
  const [howItworks, setHowItWorks] = useState();
  const [loyaltyPoints, setLoyaltyPoints] = useState();
  const [referralPoints, setReferralPoints] = useState();
  const { orders, isOrdersLoading } = useOrderContext();

  const { panel, onPanelSelect } = usePanel();

  return (
    <div className="pb-30">
      <div className="bg-brand/90 px-3">
        <div className=" pt-5 pb-16 md:max-w-6xl  mx-3 md:mx-auto ">
          <div className=" text-white flex flex-row justify-between">
            <div className="flex flex-row py-1 items-center gap-2 bg-brand/50 px-2 rounded-full">
              <Icon name={"MapPin"} />

              <div className="flex flex-col gap-0">
                <span className="text-xs text-white/80">Pickup from</span>
                <span className="font-semibold text-sm">{pickupAddress}</span>
              </div>

              <Icon name="ChevronDown" size={18} />
            </div>

            <div className="flex flex-row items-center gap-8 pr-2">
              <motion.button
                className=""
                onClick={() => {
                  onPanelSelect("messages");
                }}
              >
                <Icon name="MessageCircle" />
              </motion.button>
              <motion.button
                onClick={() => {
                  onPanelSelect("notifications");
                }}
              >
                <Icon name="Bell" />
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-[-26]">
        <div className="flex flex-row  bg-background md:max-w-6xl  mx-3 md:mx-auto  justify-between px-4 py-3 border-[0.1] shadow-sm border-paragraph/40 rounded-2xl ">
          <div className="flex flex-row gap-3 items-center">
            <div className="bg-brand/10 flex items-center px-3 py-3 rounded-3xl">
              <Icon name="ShoppingBag" className="" color="#004a94" />
            </div>

            <div className="flex flex-col">
              <span className="font-semibold text-[16px]">
                Ready for a fresh load?
              </span>
              <span className="text-paragraph/80 text-[13px]">
                Schedule a pickup today
              </span>
            </div>
          </div>

          <button className="px-1 rounded-full py-2">
            <Icon name="ChevronRight" size={20} color="#666" />
          </button>
        </div>
      </div>

      {/* content */}
      <div className="max-w-6xl mx-auto py-5">
        {mockOrder.length > 0 && (
          <div>
            <LiveOrderPreview orders={mockOrder} />
          </div>
        )}

        {draftOrders.length > 0 && (
          <div>
            <RecentDraftOrders draftOrder={draftOrders} />
          </div>
        )}

        <div>
          <ServiceList services={services} />
        </div>

        {promotions && (
          <div>
            <PromotionList promotions={promotions} />
          </div>
        )}

        <div>
          <ReferralCard />
        </div>
      </div>
    </div>
  );
}
