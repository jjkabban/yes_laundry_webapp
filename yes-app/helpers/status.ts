import { OrderStatus } from "@/context/types/order";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    title: string;
    pastInfo: string;
    extraInfo: string;
    bg: string;
    text: string;
    dot: string;
  }
> = {
  PENDING: {
    title: "Setting up your order",
    pastInfo: "Order submitted by user",
    extraInfo: "Waiting for store confirmation.",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  CONFIRMED: {
    title: "Order accepted by store",
    pastInfo: "Store accepted your order",
    extraInfo: "A driver will be assigned shortly.",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  PICKED_UP: {
    title: "Driver heading to facility",
    pastInfo: "Clothes collected by driver",
    extraInfo: "En route to the cleaning hub.",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  IN_PROGRESS: {
    title: "Clothes are being cleaned",
    pastInfo: "Washing and drying started",
    extraInfo: "Treating stains and folding underway.",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  READY: {
    title: "Ready for delivery",
    pastInfo: "Cleaning and packing finished",
    extraInfo: "Awaiting sorting into delivery van.",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  OUT_FOR_DELIVERY: {
    title: "Driver is on their way to you",
    pastInfo: "Order left the facility",
    extraInfo: "Your driver is delivering to your doorstep.",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  DELIVERED: {
    title: "Delivered safely",
    pastInfo: "Dropped off at doorstep",
    extraInfo: "Thank you for using our service!",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  CANCELLED: {
    title: "This order was cancelled",
    pastInfo: "Order cancelled",
    extraInfo: "Your payment has been successfully refunded.",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};
