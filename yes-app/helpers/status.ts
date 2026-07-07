import { LiveOrderEvent, OrderStatus } from "@/types/shared/order.type";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    title: string;
    pastInfo: string;
    bg: string;
    text: string;
    dot: string;
  }
> = {
  PENDING: {
    title: "Setting up your order",
    pastInfo: "Order placed",
    bg: "bg-orange-50",
    text: "text-orange-700",
    dot: "bg-orange-400",
  },
  CONFIRMED: {
    title: "Store accepted your order",
    pastInfo: "Order confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-400",
  },
  PICKED_UP: {
    title: "Driver heading to facility",
    pastInfo: "Clothes picked up",
    bg: "bg-violet-50",
    text: "text-violet-700",
    dot: "bg-violet-400",
  },
  IN_PROGRESS: {
    title: "Washing your clothes",
    pastInfo: "Cleaning started",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    dot: "bg-yellow-400",
  },
  READY: {
    title: "Ready for delivery",
    pastInfo: "Packed and ready",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-400",
  },
  OUT_FOR_DELIVERY: {
    title: "Driver is on the way",
    pastInfo: "Out for delivery",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
  },
  DELIVERED: {
    title: "Delivered safely",
    pastInfo: "Delivered",
    bg: "bg-green-50",
    text: "text-green-700",
    dot: "bg-green-400",
  },
  CANCELLED: {
    title: "This order was cancelled",
    pastInfo: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-400",
  },
};

// ─── Relative time ─────────────────────────────────────────────

export function formatTimeAgo(date: string | Date): string {
  const then = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - then.getTime()) / 1000);

  if (seconds < 60) return "just now";

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const STATUS_SEQUENCE: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PICKED_UP",
  "IN_PROGRESS",
  "READY",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

function getPreviousStatus(status: OrderStatus): OrderStatus | null {
  const index = STATUS_SEQUENCE.indexOf(status);
  return index > 0 ? STATUS_SEQUENCE[index - 1] : null;
}

function findStatusTimestamp(
  events: LiveOrderEvent[] | undefined,
  targetStatus: OrderStatus | null,
): string | null {
  if (!targetStatus || !events) return null;
  return events.find((e) => e.status === targetStatus)?.createdAt ?? null;
}

export function getOrderStatusInfo(
  status: OrderStatus,
  events?: LiveOrderEvent[],
): { current: string; past: string | null; timestamp: string | null } {
  const config = ORDER_STATUS_CONFIG[status];
  const previousStatus = getPreviousStatus(status);

  let past: string | null = null;
  let timestamp: string | null = null;
  if (previousStatus) {
    const prevConfig = ORDER_STATUS_CONFIG[previousStatus];
    timestamp = findStatusTimestamp(events, previousStatus);
    past = timestamp ? `${prevConfig.pastInfo}` : prevConfig.pastInfo;
  }

  return {
    current: config.title,
    past,
    timestamp: formatTimeAgo((timestamp as string) ?? new Date()),
  };
}
