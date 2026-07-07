"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Clock,
  MapPin,
  Package,
  Pencil,
  Play,
  RefreshCw,
  Shirt,
  Sparkles,
  StopCircle,
  Timer,
  Truck,
  Wallet,
  X,
  type LucideIcon,
} from "lucide-react";
import {
  RecurringOrder,
  RecurringOrderItem,
  RecurrenceFrequency,
  OrderService,
} from "@/types/shared/order.type";
import { BottomSheet } from "@/components/components";

// Display-only extension — OrderService doesn't carry price/turnaround
// time, so those two display fields are added here rather than in the
// shared type.
interface RecurringOrderServiceView extends OrderService {
  basePrice: number;
  turnaroundTime: string;
}

interface RecurringOrderView extends RecurringOrder {
  service?: RecurringOrderServiceView;
  items: RecurringOrderItem[];
  estimatedTotal: number;
}

type EditTarget = "items" | "pickup" | "delivery" | "stop" | null;

// icon string -> lucide component
const serviceIconMap: Record<string, LucideIcon> = {
  sparkles: Sparkles,
  shirt: Shirt,
};

function ServiceIcon({
  icon,
  size = 16,
  className = "",
}: {
  icon?: string;
  size?: number;
  className?: string;
}) {
  const Icon = (icon && serviceIconMap[icon]) || Package;
  return <Icon size={size} className={className} />;
}

// ── Mock data ─────────────────────────────────────────────────
const mockRecurringOrders: RecurringOrderView[] = [
  {
    id: "rec_001",
    customerId: "user_001",
    serviceId: "svc_001",
    service: {
      id: "svc_001",
      name: "Stain removal",
      priceModel: "PER_ITEM",
      icon: "sparkles",
      basePrice: 15,
      turnaroundTime: "24 hrs",
    },
    frequency: "WEEKLY",
    dayOfWeek: 3,
    preferredTime: "8:00 AM - 12:00 PM",
    pickupAddress: "123 Main St, Accra, Ghana",
    deliveryAddress: "123 Main St, Accra, Ghana",
    isActive: true,
    nextRunAt: "2026-07-08",
    lastRunAt: "2026-07-01",
    generatedOrders: [
      { id: "ord_101", orderNumber: "R-2024-001", status: "DELIVERED" },
    ],
    items: [
      {
        id: "item_001",
        recurringOrderId: "rec_001",
        serviceItemId: "si_001",
        serviceItem: {
          id: "si_001",
          unitPrice: 15,
          item: { name: "Shirts - Standard" },
        },
        quantity: 3,
        priceAtOrder: 15,
        createdAt: "2026-06-01T10:00:00Z",
        updatedAt: "2026-06-01T10:00:00Z",
      },
      {
        id: "item_002",
        recurringOrderId: "rec_001",
        serviceItemId: "si_002",
        serviceItem: {
          id: "si_002",
          unitPrice: 20,
          item: { name: "Pants - Delicate" },
        },
        quantity: 2,
        priceAtOrder: 20,
        createdAt: "2026-06-01T10:00:00Z",
        updatedAt: "2026-06-01T10:00:00Z",
      },
    ],
    estimatedTotal: 85,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
  {
    id: "rec_002",
    customerId: "user_001",
    serviceId: "svc_002",
    service: {
      id: "svc_002",
      name: "Standard wash",
      priceModel: "PER_ITEM",
      icon: "shirt",
      basePrice: 10,
      turnaroundTime: "48 hrs",
    },
    frequency: "BIWEEKLY",
    dayOfWeek: 5,
    preferredTime: "10:00 AM - 2:00 PM",
    pickupAddress: "456 Park Ave, Accra, Ghana",
    deliveryAddress: "456 Park Ave, Accra, Ghana",
    isActive: true,
    nextRunAt: "2026-07-12",
    lastRunAt: "2026-06-28",
    generatedOrders: [
      { id: "ord_102", orderNumber: "R-2024-002", status: "DELIVERED" },
    ],
    items: [
      {
        id: "item_003",
        recurringOrderId: "rec_002",
        serviceItemId: "si_003",
        serviceItem: {
          id: "si_003",
          unitPrice: 10,
          item: { name: "T-Shirts - Standard" },
        },
        quantity: 5,
        priceAtOrder: 10,
        createdAt: "2026-06-14T10:00:00Z",
        updatedAt: "2026-06-14T10:00:00Z",
      },
    ],
    estimatedTotal: 50,
    createdAt: "2026-06-14T10:00:00Z",
    updatedAt: "2026-06-28T10:00:00Z",
  },
  {
    id: "rec_003",
    customerId: "user_001",
    serviceId: "svc_001",
    service: {
      id: "svc_001",
      name: "Stain removal",
      priceModel: "PER_ITEM",
      icon: "sparkles",
      basePrice: 18,
      turnaroundTime: "24 hrs",
    },
    frequency: "MONTHLY",
    dayOfMonth: 1,
    preferredTime: "8:00 AM - 10:00 AM",
    pickupAddress: "789 Beach Rd, Accra, Ghana",
    deliveryAddress: "789 Beach Rd, Accra, Ghana",
    isActive: false,
    nextRunAt: "2026-08-01",
    lastRunAt: "2026-07-01",
    generatedOrders: [
      { id: "ord_103", orderNumber: "R-2024-003", status: "DELIVERED" },
    ],
    items: [
      {
        id: "item_004",
        recurringOrderId: "rec_003",
        serviceItemId: "si_004",
        serviceItem: {
          id: "si_004",
          unitPrice: 18,
          item: { name: "Formal Shirts - Premium" },
        },
        quantity: 4,
        priceAtOrder: 18,
        createdAt: "2026-06-01T10:00:00Z",
        updatedAt: "2026-06-01T10:00:00Z",
      },
    ],
    estimatedTotal: 72,
    createdAt: "2026-06-01T10:00:00Z",
    updatedAt: "2026-07-01T10:00:00Z",
  },
];

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Every 2 weeks",
  MONTHLY: "Monthly",
};

function formatNextDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

function shortAddress(address: string) {
  return address.split(",")[0];
}

// ── Main page ─────────────────────────────────────────────────
export default function RecurringOrdersPage() {
  const router = useRouter();
  const [recurringOrders, setRecurringOrders] = useState<RecurringOrderView[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  // sheet state
  const [activeOrderId, setActiveOrderId] = useState<string | null>(null);
  const [editTarget, setEditTarget] = useState<EditTarget>(null);

  // editable draft fields (local, flushed to recurringOrders on "Done")
  const [draftPickupAddress, setDraftPickupAddress] = useState("");
  const [draftDeliveryAddress, setDraftDeliveryAddress] = useState("");
  const [draftPreferredTime, setDraftPreferredTime] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setRecurringOrders(mockRecurringOrders);
      setIsLoading(false);
    }, 400);
  }, []);

  const activeOrder =
    recurringOrders.find((o) => o.id === activeOrderId) ?? null;

  function openEditor(order: RecurringOrderView, target: EditTarget) {
    setActiveOrderId(order.id);
    setEditTarget(target);
    setDraftPickupAddress(order.pickupAddress);
    setDraftDeliveryAddress(order.deliveryAddress);
    setDraftPreferredTime(order.preferredTime);
  }

  function closeSheet() {
    setActiveOrderId(null);
    setEditTarget(null);
  }

  function saveSheet() {
    if (!activeOrderId) return;

    setRecurringOrders((prev) =>
      prev.map((o) => {
        if (o.id !== activeOrderId) return o;

        if (editTarget === "pickup") {
          return {
            ...o,
            pickupAddress: draftPickupAddress,
            preferredTime: draftPreferredTime,
          };
        }
        if (editTarget === "delivery") {
          return {
            ...o,
            deliveryAddress: draftDeliveryAddress,
          };
        }
        if (editTarget === "stop") {
          return { ...o, isActive: !o.isActive };
        }
        return o;
      }),
    );
    closeSheet();
  }

  function updateItemQty(itemId: string, delta: number) {
    if (!activeOrderId) return;
    setRecurringOrders((prev) =>
      prev.map((o) => {
        if (o.id !== activeOrderId) return o;
        const items = o.items.map((it) =>
          it.id === itemId
            ? { ...it, quantity: Math.max(1, it.quantity + delta) }
            : it,
        );
        return {
          ...o,
          items,
          estimatedTotal: items.reduce(
            (sum, it) => sum + it.quantity * it.priceAtOrder,
            0,
          ),
        };
      }),
    );
  }

  // ── Loading ───────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-foreground">
        <div className="text-center">
          <RefreshCw className="w-10 h-10 text-brand animate-spin mx-auto mb-3" />
          <p className="text-paragraph/60 text-[14px]">
            Loading recurring orders…
          </p>
        </div>
      </div>
    );
  }

  // ── Empty ─────────────────────────────────────────────────
  if (recurringOrders.length === 0) {
    return (
      <div className="px-5 py-4 max-w-4xl mx-auto min-h-screen bg-foreground">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-paragraph">
            Recurring Orders
          </h1>
          <button onClick={() => router.back()}>
            <X size={20} />
          </button>
        </div>

        <div className="mt-24 flex flex-col items-center p-8 text-center">
          <div className="w-20 h-20 bg-brand/10 rounded-full flex items-center justify-center mb-4">
            <CalendarPlus className="w-10 h-10 text-brand" />
          </div>
          <h3 className="text-lg font-semibold text-paragraph mb-2">
            No Recurring Orders
          </h3>
          <p className="text-paragraph/60 text-sm mb-4">
            Plan your laundry to be automatically booked on a regular schedule.
          </p>
          <button
            onClick={() => router.push("/select-service")}
            className="bg-brand text-white px-6 py-2.5 rounded-xl"
          >
            Start an order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-foreground pb-24">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-3">
        <button onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-[22px] font-bold text-paragraph">
          Recurring Orders
        </h1>
      </div>

      {/* ── Cards ──────────────────────────────────────────── */}
      <div className="px-5 flex flex-col gap-4">
        {recurringOrders.map((rord) => {
          const isPaused = !rord.isActive;
          const itemCount = rord.items.reduce(
            (sum, it) => sum + it.quantity,
            0,
          );

          return (
            <div
              key={rord.id}
              className={`bg-white rounded-3xl border overflow-hidden shadow-sm shadow-paragraph/[0.03] transition-opacity
                ${isPaused ? "border-paragraph/8 opacity-60" : "border-paragraph/8"}`}
            >
              {/* header row */}
              <div className="flex items-center justify-between px-5 pt-5">
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <div className="p-1.5 rounded-lg bg-brand/10 shrink-0">
                    <ServiceIcon
                      icon={rord.service?.icon}
                      size={14}
                      className="text-brand"
                    />
                  </div>
                  <h2 className="text-[16px] font-semibold text-paragraph truncate">
                    {rord.service?.name ?? "Standard wash"}
                  </h2>
                </div>
                <span
                  className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium
                    ${isPaused ? "bg-paragraph/8 text-paragraph/50" : "bg-brand/10 text-brand"}`}
                >
                  {isPaused ? "Paused" : frequencyLabels[rord.frequency]}
                </span>
              </div>

              {/* next run highlight */}
              <div className="mx-5 mt-3 rounded-2xl bg-gradient-to-br from-brand/[0.07] to-brand/[0.02] border border-brand/10 px-4 py-3 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-brand/10 shrink-0">
                  <Calendar size={15} className="text-brand" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] uppercase tracking-wide text-paragraph/40 font-medium">
                    {isPaused ? "Resumes" : "Next pickup"}
                  </p>
                  <p className="text-[14px] font-semibold text-paragraph mt-0.5">
                    {formatNextDate(rord.nextRunAt)}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0 text-right">
                  <Clock size={13} className="text-paragraph/40" />
                  <span className="text-[12px] font-medium text-paragraph/70">
                    {rord.preferredTime}
                  </span>
                </div>
              </div>

              {/* top info grid: items, pickup, delivery, price */}
              <div className="grid grid-cols-2 gap-2.5 px-5 mt-4">
                <div className="rounded-xl bg-paragraph/[0.03] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-paragraph/40">
                    <Package size={12} />
                    <span className="text-[10.5px] uppercase tracking-wide font-medium">
                      Items
                    </span>
                  </div>
                  <p className="text-[13.5px] font-semibold text-paragraph mt-1">
                    {itemCount} item{itemCount !== 1 ? "s" : ""}
                  </p>
                </div>

                <div className="rounded-xl bg-paragraph/[0.03] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-paragraph/40">
                    <Wallet size={12} />
                    <span className="text-[10.5px] uppercase tracking-wide font-medium">
                      Per cycle
                    </span>
                  </div>
                  <p className="text-[13.5px] font-semibold text-brand mt-1">
                    GH₵{rord.estimatedTotal.toFixed(2)}
                  </p>
                </div>

                <div className="rounded-xl bg-paragraph/[0.03] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-paragraph/40">
                    <MapPin size={12} />
                    <span className="text-[10.5px] uppercase tracking-wide font-medium">
                      Pickup
                    </span>
                  </div>
                  <p className="text-[13.5px] font-semibold text-paragraph mt-1 truncate">
                    {shortAddress(rord.pickupAddress)}
                  </p>
                </div>

                <div className="rounded-xl bg-paragraph/[0.03] px-3 py-2.5">
                  <div className="flex items-center gap-1.5 text-paragraph/40">
                    <Truck size={12} />
                    <span className="text-[10.5px] uppercase tracking-wide font-medium">
                      Delivery
                    </span>
                  </div>
                  <p className="text-[13.5px] font-semibold text-paragraph mt-1 truncate">
                    {shortAddress(rord.deliveryAddress)}
                  </p>
                </div>
              </div>

              {/* ── Edit action row ─────────────────────────── */}
              <div className="grid grid-cols-4 divide-x divide-paragraph/6 mt-4 border-t border-paragraph/6">
                <button
                  onClick={() => openEditor(rord, "items")}
                  className="flex flex-col items-center gap-1 py-3 text-paragraph/60 hover:text-brand hover:bg-brand/[0.04] transition-colors"
                >
                  <Pencil size={16} />
                  <span className="text-[11px] font-medium">Items</span>
                </button>
                <button
                  onClick={() => openEditor(rord, "pickup")}
                  className="flex flex-col items-center gap-1 py-3 text-paragraph/60 hover:text-brand hover:bg-brand/[0.04] transition-colors"
                >
                  <MapPin size={16} />
                  <span className="text-[11px] font-medium">Pickup</span>
                </button>
                <button
                  onClick={() => openEditor(rord, "delivery")}
                  className="flex flex-col items-center gap-1 py-3 text-paragraph/60 hover:text-brand hover:bg-brand/[0.04] transition-colors"
                >
                  <Truck size={16} />
                  <span className="text-[11px] font-medium">Delivery</span>
                </button>
                <button
                  onClick={() => openEditor(rord, "stop")}
                  className={`flex flex-col items-center gap-1 py-3 transition-colors
                    ${isPaused ? "text-green-600 hover:bg-green-50" : "text-red-500 hover:bg-red-50"}`}
                >
                  {isPaused ? <Play size={16} /> : <StopCircle size={16} />}
                  <span className="text-[11px] font-medium">
                    {isPaused ? "Resume" : "Stop"}
                  </span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Bottom sheet editor ──────────────────────────────── */}
      <BottomSheet
        open={!!activeOrderId && !!editTarget}
        onClose={closeSheet}
        height={
          editTarget === "items" ? "70%" : editTarget === "stop" ? "50%" : "70%"
        }
      >
        <div className="p-5 flex flex-col h-full">
          {/* sheet header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-semibold">
              {editTarget === "items" && "Edit items"}
              {editTarget === "pickup" && "Edit pickup"}
              {editTarget === "delivery" && "Edit delivery"}
              {editTarget === "stop" &&
                (activeOrder?.isActive
                  ? "Stop recurring order"
                  : "Resume order")}
            </h3>
            <button onClick={closeSheet}>
              <X size={20} className="text-paragraph/50" />
            </button>
          </div>

          {/* ── Service context card ─────────────────────────── */}
          {activeOrder && (
            <div className="flex items-center gap-3 rounded-2xl bg-paragraph/[0.03] border border-paragraph/6 px-4 py-3 mb-5">
              <div className="p-2.5 rounded-xl bg-brand/10 shrink-0">
                <ServiceIcon
                  icon={activeOrder.service?.icon}
                  size={18}
                  className="text-brand"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[14px] font-semibold text-paragraph truncate">
                  {activeOrder.service?.name ?? "Service"}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-[12.5px] font-medium text-brand">
                    GH₵{activeOrder.service?.basePrice.toFixed(2) ?? "—"}
                  </span>
                  <span className="text-[12px] text-paragraph/30">•</span>
                  <div className="flex items-center gap-1 text-paragraph/50">
                    <Timer size={11} />
                    <span className="text-[12px]">
                      {activeOrder.service?.turnaroundTime ?? "—"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Items editor ────────────────────────────────── */}
          {editTarget === "items" && activeOrder && (
            <div className="flex-1 overflow-y-auto flex flex-col gap-3">
              {activeOrder.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between bg-paragraph/4 rounded-xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="text-[14px] font-medium truncate">
                      {item.serviceItem?.item?.name ?? "Item"}
                    </p>
                    <p className="text-[12px] text-paragraph/50 mt-0.5">
                      GH₵{item.priceAtOrder} each
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <button
                      onClick={() => updateItemQty(item.id, -1)}
                      className="w-7 h-7 rounded-full bg-white border border-paragraph/15 flex items-center justify-center text-[16px]"
                    >
                      −
                    </button>
                    <span className="text-[14px] font-medium w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateItemQty(item.id, 1)}
                      className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-[16px]"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Pickup editor ───────────────────────────────── */}
          {editTarget === "pickup" && (
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-paragraph/50 mb-1.5 block">
                  Pickup address
                </label>
                <input
                  value={draftPickupAddress}
                  onChange={(e) => setDraftPickupAddress(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border-2 border-paragraph/15 outline-none focus:border-brand text-[14px]"
                />
              </div>
              <div>
                <label className="text-[12px] font-medium text-paragraph/50 mb-1.5 block">
                  Preferred time
                </label>
                <div className="flex flex-col gap-2">
                  {[
                    "8:00 AM - 12:00 PM",
                    "12:00 PM - 4:00 PM",
                    "4:00 PM - 8:00 PM",
                  ].map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setDraftPreferredTime(slot)}
                      className={`text-left px-4 py-3 rounded-xl border-2 text-[14px] transition-colors
                          ${
                            draftPreferredTime === slot
                              ? "border-brand bg-brand/5 text-brand font-medium"
                              : "border-paragraph/10 text-paragraph/70"
                          }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Delivery editor ─────────────────────────────── */}
          {editTarget === "delivery" && (
            <div className="flex-1 flex flex-col gap-4">
              <div>
                <label className="text-[12px] font-medium text-paragraph/50 mb-1.5 block">
                  Delivery address
                </label>
                <input
                  value={draftDeliveryAddress}
                  onChange={(e) => setDraftDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-3 rounded-xl border-2 border-paragraph/15 outline-none focus:border-brand text-[14px]"
                />
              </div>
              <p className="text-[12.5px] text-paragraph/50 leading-relaxed">
                Delivery follows the same preferred time set for pickup.
              </p>
            </div>
          )}

          {/* ── Stop / resume confirm ───────────────────────── */}
          {editTarget === "stop" && activeOrder && (
            <div className="flex-1 flex flex-col items-center text-center justify-center gap-3 px-2">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center
                  ${activeOrder.isActive ? "bg-red-50" : "bg-green-50"}`}
              >
                {activeOrder.isActive ? (
                  <StopCircle size={24} className="text-red-500" />
                ) : (
                  <Play size={22} className="text-green-600" />
                )}
              </div>
              <p className="text-[14px] text-paragraph/70 leading-relaxed">
                {activeOrder.isActive
                  ? "This will stop all upcoming scheduled pickups for this recurring order. You can resume it anytime."
                  : "This will resume your recurring order on its regular schedule."}
              </p>
            </div>
          )}

          {/* ── Done / confirm button ────────────────────────── */}
          <button
            onClick={saveSheet}
            disabled={
              (editTarget === "pickup" &&
                (!draftPickupAddress || !draftPreferredTime)) ||
              (editTarget === "delivery" && !draftDeliveryAddress)
            }
            className={`mt-4 w-full py-3.5 rounded-full text-[15px] font-semibold transition-opacity
              ${
                editTarget === "stop" && activeOrder?.isActive
                  ? "bg-red-500 text-white"
                  : "bg-brand text-white"
              }
              disabled:opacity-30`}
          >
            {editTarget === "items" && "Done"}
            {editTarget === "pickup" && "Save pickup details"}
            {editTarget === "delivery" && "Save delivery details"}
            {editTarget === "stop" &&
              (activeOrder?.isActive ? "Stop recurring order" : "Resume order")}
          </button>
        </div>
      </BottomSheet>
    </div>
  );
}
