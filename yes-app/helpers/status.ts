import { OrderStatus } from "@/context/types/order";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; dot: string }
> = {
  PENDING: {
    label: "Awaiting Confirmation",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  PICKED_UP: {
    label: "Picked Up",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  IN_PROGRESS: {
    label: "Cleaning",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  READY: {
    label: "Ready for Delivery",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  OUT_FOR_DELIVERY: {
    label: "Out for Delivery",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  DELIVERED: {
    label: "Delivered",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  CANCELLED: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};
