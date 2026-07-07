"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Bell,
  BellOff,
  CheckCheck,
  ChevronRight,
  Megaphone,
  Package,
  RefreshCcw,
  Settings,
  Star,
  Tag,
  Truck,
  WashingMachine,
  X,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────

type NotificationType =
  | "ORDER_UPDATE"
  | "DELIVERY"
  | "PROMOTION"
  | "REVIEW_REQUEST"
  | "SYSTEM";

type Notification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  orderId?: string;
  read: boolean;
  createdAt: string; // ISO string
};

// ── Mock data (replace with real context/API) ────────────────
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "ORDER_UPDATE",
    title: "Order picked up",
    body: "Your rider just picked up your laundry. Sit tight — we'll handle it from here.",
    orderId: "ord_001",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
  },
  {
    id: "n2",
    type: "ORDER_UPDATE",
    title: "Order confirmed",
    body: "Your order #1042 has been confirmed and a rider will be assigned shortly.",
    orderId: "ord_001",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 42).toISOString(),
  },
  {
    id: "n3",
    type: "PROMOTION",
    title: "20% off this weekend",
    body: "Book any wash before Sunday and save 20%. Use code FRESH20 at checkout.",
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: "n4",
    type: "DELIVERY",
    title: "Order delivered!",
    body: "Your laundry for order #1039 has been delivered. Fresh and ready.",
    orderId: "ord_039",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(),
  },
  {
    id: "n5",
    type: "REVIEW_REQUEST",
    title: "How was your last order?",
    body: "Rate your experience with order #1039. It only takes a second.",
    orderId: "ord_039",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 27).toISOString(),
  },
  {
    id: "n6",
    type: "ORDER_UPDATE",
    title: "Out for delivery",
    body: "Your freshly washed clothes are on their way back to you for order #1039.",
    orderId: "ord_039",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
  },
  {
    id: "n7",
    type: "SYSTEM",
    title: "New service available",
    body: "We now offer professional dry cleaning in your area. Book a pickup today.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
  },
  {
    id: "n8",
    type: "PROMOTION",
    title: "Refer a friend, earn GH₵10",
    body: "Share your referral code and get GH₵10 credit when your friend places their first order.",
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
  },
];

// ── Helpers ───────────────────────────────────────────────────

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  const hours = Math.floor(mins / 60);
  const days = Math.floor(hours / 24);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en", {
    month: "short",
    day: "numeric",
  });
}

function groupByDate(notifications: Notification[]) {
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterdayStart = new Date(todayStart.getTime() - 86400000);
  const weekStart = new Date(todayStart.getTime() - 6 * 86400000);

  const groups: { label: string; items: Notification[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This week", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const n of notifications) {
    const d = new Date(n.createdAt);
    if (d >= todayStart) groups[0].items.push(n);
    else if (d >= yesterdayStart) groups[1].items.push(n);
    else if (d >= weekStart) groups[2].items.push(n);
    else groups[3].items.push(n);
  }

  return groups.filter((g) => g.items.length > 0);
}

// ── Icon per type ─────────────────────────────────────────────
const TYPE_CONFIG: Record<
  NotificationType,
  { icon: React.ElementType; bg: string; color: string }
> = {
  ORDER_UPDATE: { icon: WashingMachine, bg: "bg-brand/10", color: "#b8964e" },
  DELIVERY: { icon: Truck, bg: "bg-green-50", color: "#16a34a" },
  PROMOTION: { icon: Tag, bg: "bg-violet-50", color: "#7c3aed" },
  REVIEW_REQUEST: { icon: Star, bg: "bg-amber-50", color: "#d97706" },
  SYSTEM: { icon: Megaphone, bg: "bg-blue-50", color: "#2563eb" },
};

// ── Single notification row ───────────────────────────────────
function NotificationRow({
  notification,
  onRead,
  onDismiss,
  onPress,
}: {
  notification: Notification;
  onRead: (id: string) => void;
  onDismiss: (id: string) => void;
  onPress: (n: Notification) => void;
}) {
  const cfg = TYPE_CONFIG[notification.type];
  const Icon = cfg.icon;
  const isActionable = !!notification.orderId;

  return (
    <div
      onClick={() => {
        if (!notification.read) onRead(notification.id);
        onPress(notification);
      }}
      className={`relative flex gap-3 px-4 py-4 cursor-pointer transition-colors active:bg-paragraph/5
        ${!notification.read ? "bg-brand/[0.04]" : "bg-white"}`}
    >
      {/* unread dot */}
      {!notification.read && (
        <span className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-brand" />
      )}

      {/* icon */}
      <div
        className={`shrink-0 mt-0.5 w-10 h-10 rounded-xl flex items-center justify-center ${cfg.bg}`}
      >
        <Icon size={16} color={cfg.color} />
      </div>

      {/* content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-[14px] leading-tight ${
              notification.read
                ? "font-medium text-paragraph"
                : "font-semibold text-paragraph"
            }`}
          >
            {notification.title}
          </p>
          <span className="text-[11px] text-paragraph/40 shrink-0 mt-0.5">
            {timeAgo(notification.createdAt)}
          </span>
        </div>
        <p className="text-[13px] text-paragraph/60 mt-1 leading-snug line-clamp-2">
          {notification.body}
        </p>
        {isActionable && (
          <div className="flex items-center gap-1 mt-2">
            <span className="text-[12px] text-brand font-medium">
              View order
            </span>
            <ChevronRight size={12} color="#b8964e" />
          </div>
        )}
      </div>

      {/* dismiss */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="shrink-0 self-start mt-0.5 p-1 rounded-full hover:bg-paragraph/8 transition-colors"
      >
        <X size={13} className="text-paragraph/30" />
      </button>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────
export default function NotificationScreen() {
  const router = useRouter();
  const [notifications, setNotifications] =
    useState<Notification[]>(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  );

  const grouped = useMemo(() => groupByDate(notifications), [notifications]);

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  function handlePress(n: Notification) {
    if (n.orderId) {
      router.push(`order-detail?oid=${n.orderId}`);
    }
  }

  return (
    <div className="min-h-screen bg-foreground pb-24">
      {/* ── Fixed header ──────────────────────────────────── */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-foreground/95 backdrop-blur-sm border-b border-paragraph/8 px-4 pt-4 pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="p-1.5 -ml-1.5 rounded-full hover:bg-paragraph/8 transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div className="flex items-center gap-2">
              <h1 className="text-[22px] font-bold">Notifications</h1>
              {unreadCount > 0 && (
                <span className="bg-brand text-white text-[11px] font-bold px-2 py-0.5 rounded-full min-w-[22px] text-center">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium text-brand hover:bg-brand/8 transition-colors"
              >
                <CheckCheck size={14} />
                Mark all read
              </button>
            )}
            <button
              onClick={() => router.push("notification-settings")}
              className="p-2 rounded-full hover:bg-paragraph/8 transition-colors"
            >
              <Settings size={18} className="text-paragraph/60" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Empty state ───────────────────────────────────── */}
      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-8 text-center">
          <div className="w-16 h-16 rounded-full bg-paragraph/6 flex items-center justify-center">
            <BellOff size={28} className="text-paragraph/30" />
          </div>
          <div>
            <h2 className="text-[18px] font-semibold">All caught up</h2>
            <p className="text-[14px] text-paragraph/55 mt-1">
              No notifications yet. We'll let you know when something happens.
            </p>
          </div>
          <button
            onClick={() => router.push("select-service")}
            className="mt-2 bg-brand text-white px-8 py-2.5 rounded-full text-[14px] font-medium"
          >
            Place an order
          </button>
        </div>
      ) : (
        <div className="pt-[76px]">
          {grouped.map((group, gIdx) => (
            <div key={group.label}>
              {/* Group label */}
              <div className="px-4 py-2.5 flex items-center gap-3">
                <span className="text-[11px] uppercase tracking-widest font-semibold text-paragraph/40">
                  {group.label}
                </span>
                <div className="flex-1 h-px bg-paragraph/8" />
              </div>

              {/* Notification rows */}
              <div className="flex flex-col divide-y divide-paragraph/8">
                {group.items.map((n) => (
                  <NotificationRow
                    key={n.id}
                    notification={n}
                    onRead={markRead}
                    onDismiss={dismiss}
                    onPress={handlePress}
                  />
                ))}
              </div>
            </div>
          ))}

          {/* ── Bottom clear-all ──────────────────────────── */}
          {notifications.length > 0 && (
            <div className="flex justify-center pt-6 pb-2">
              <button
                onClick={() => setNotifications([])}
                className="flex items-center gap-1.5 text-[13px] text-paragraph/40 hover:text-paragraph/60 transition-colors"
              >
                <RefreshCcw size={12} />
                Clear all notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
