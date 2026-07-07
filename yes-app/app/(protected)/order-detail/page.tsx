"use client";

import OrderStepper from "@/components/ui/OrdersStepper";
import { useOrderContext } from "@/context/OrderContext";
import { Order, OrderStatus } from "@/types/shared/order.type";
import { getOrderStatusInfo, ORDER_STATUS_CONFIG } from "@/helpers/status";
import { formatDate } from "@/utils/datetime";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  MapPin,
  MessageSquare,
  Package,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  Star,
  Truck,
  WashingMachine,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";

const LIVE_STATUSES: OrderStatus[] = [
  "PENDING",
  "CONFIRMED",
  "PICKED_UP",
  "IN_PROGRESS",
  "READY",
  "OUT_FOR_DELIVERY",
];

const SLOT_LABELS: Record<string, string> = {
  MORNING: "Morning",
  AFTERNOON: "Afternoon",
  EVENING: "Evening",
};

// Plain data helper — not JSX, stays as a function
function getEtaLabel(deliveryWindow?: string | null): string | null {
  if (!deliveryWindow) return null;
  const target = new Date(deliveryWindow).getTime();
  const now = Date.now();
  const diffMs = target - now;

  if (diffMs <= 0) return "Delivery window has passed";

  const hours = Math.round(diffMs / (1000 * 60 * 60));
  if (hours < 1) return "Delivery within the hour";
  if (hours === 1) return "Delivery in about 1 hour";
  return `Delivery in about ${hours} hours`;
}

// Formats just the clock time portion out of a full DateTime string, e.g. "14:00"
function getTimeOfDay(dateString?: string | null): string | null {
  if (!dateString) return null;
  const d = new Date(dateString);
  if (isNaN(d.getTime())) return null;
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function OrderDetailPage() {
  const router = useRouter();
  const params = useSearchParams();
  const orderId = params.get("oid");

  const { orderData, isOrdersLoading } = useOrderContext();

  const order = useMemo(
    () => orderData?.find((o) => o.id === orderId) ?? null,
    [orderData, orderId],
  );

  const status = order?.status ?? "PENDING";

  const orderStatusInfo = useMemo(() => {
    const statusInfo = getOrderStatusInfo(status, order?.events);
    return statusInfo;
  }, [status]);

  const orderState = useMemo(() => {
    if (status === "DELIVERED") return "delivered";
    if (status === "CANCELLED") return "cancelled";
    if (LIVE_STATUSES.includes(status)) return "live";
    return "idle";
  }, [status]);

  if (isOrdersLoading) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <WashingMachine size={30} className="text-brand animate-spin" />
          <p className="text-[14px] text-paragraph/50">Loading order…</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-foreground flex items-center justify-center flex-col gap-3 px-8 text-center">
        <div className="p-6 rounded-full bg-brand/10">
          <ShoppingBag size={36} className="text-brand" />
        </div>
        <h2 className="text-lg font-semibold">Order not found</h2>
        <p className="text-[14px] text-paragraph/60">
          We couldn't find this order.
        </p>
        <button
          onClick={() => router.back()}
          className="mt-2 bg-brand text-white px-6 py-2.5 rounded-full text-[14px] font-medium"
        >
          Go back
        </button>
      </div>
    );
  }

  const itemCount = order.items?.length ?? 0;
  const addOnCount = order.addOns?.length ?? 0;
  const orderType = order.bagCount
    ? `${order.bagCount} bag${order.bagCount !== 1 ? "s" : ""}`
    : itemCount > 0
      ? `${itemCount} item${itemCount !== 1 ? "s" : ""}`
      : null;

  const cancelReason =
    order.events?.findLast((e) => e.eventType === "CANCELLED")?.notes ??
    "Order was cancelled";

  const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];
  const total = Number(order.total);
  const deliveryFee = Number(order.deliveryFee);
  const discount = Number(order.discount);
  const addOnsTotal =
    order.addOns?.reduce((sum, a) => sum + Number(a.priceAtOrder), 0) ?? 0;

  // ── Pickup data ──────────────────────────────────────────────
  const pickupDate = order.pickupWindow ? formatDate(order.pickupWindow) : null;
  const slotLabel = order.timeSlot
    ? (SLOT_LABELS[order.timeSlot] ?? order.timeSlot)
    : null;
  const timeRange =
    order.startTime && order.endTime
      ? `${order.startTime} – ${order.endTime}`
      : null;

  // ── Delivery data — schema only tracks a plain DateTime, no slot/range ──
  const deliveryDate = order.deliveryWindow
    ? formatDate(order.deliveryWindow)
    : null;
  const deliveryTime = getTimeOfDay(order.deliveryWindow as string | undefined);

  const eta =
    orderState === "live"
      ? getEtaLabel(order.deliveryWindow as string | undefined)
      : null;

  const statusBarTheme =
    orderState === "cancelled"
      ? {
          bg: "bg-red-50",
          border: "border-red-100",
          icon: "text-red-500",
          title: "text-red-700",
          sub: "text-red-600/80",
        }
      : orderState === "delivered"
        ? {
            bg: "bg-emerald-50",
            border: "border-emerald-100",
            icon: "text-emerald-600",
            title: "text-emerald-700",
            sub: "text-emerald-700/70",
          }
        : {
            bg: "bg-brand/6",
            border: "border-brand/15",
            icon: "text-brand",
            title: "text-paragraph",
            sub: "text-[#5a6472]",
          };

  const StatusBarIcon =
    orderState === "cancelled"
      ? XCircle
      : orderState === "delivered"
        ? CheckCircle2
        : WashingMachine;

  const statusBarTitle =
    orderState === "cancelled"
      ? "Order cancelled"
      : orderState === "delivered"
        ? "Delivered"
        : (statusConfig?.title ?? "In progress");

  const statusBarSubtitle =
    orderState === "cancelled"
      ? cancelReason
      : orderState === "delivered"
        ? `Delivered on ${formatDate(order.deliveredAt ?? order.updatedAt)}`
        : (eta ?? statusConfig?.title);

  return (
    <div className="min-h-screen bg-foreground pb-28">
      {/* Fixed header — title centered */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-foreground/95 backdrop-blur-sm border-b border-paragraph/8 px-4 py-3 flex items-center">
        <button
          onClick={() => router.back()}
          className="p-1.5 rounded-full hover:bg-paragraph/8 transition-colors shrink-0"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="flex-1 text-center text-[16px] font-semibold leading-tight truncate px-2">
          {order.service?.name ?? "Order details"}
        </h1>
        <div className="w-[32px] shrink-0" />
        {/* balances the back button so title stays visually centered */}
      </div>

      <div className="pt-[72px] flex flex-col gap-3 px-3 pb-4">
        {/* ── Hero card ─────────────────────────────────────────── */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm h-40">
          <Image
            src="/images/order_img.jpg"
            fill
            alt=""
            className={`object-cover ${orderState === "cancelled" ? "grayscale opacity-60" : ""}`}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

          <div className="absolute inset-0 p-4 flex flex-col justify-end">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-widest text-white/60 font-medium">
                  Selected
                </p>
                {orderType && (
                  <p className="text-[18px] font-medium text-white leading-tight">
                    {orderType}
                  </p>
                )}
              </div>
              <div className="text-right">
                <p className="text-[11px] text-white/60 uppercase tracking-wide">
                  Total
                </p>
                <p className="text-[22px] font-bold text-white">
                  GH₵{total.toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Status bar — inlined, right after the hero ──────────── */}
        <div
          className={`rounded-2xl border ${statusBarTheme.border} ${statusBarTheme.bg} px-4 py-4`}
        >
          <div className="flex items-start gap-3">
            <span className={`mt-0.5 shrink-0 ${statusBarTheme.icon}`}>
              <StatusBarIcon size={20} />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <p
                  className={`text-[15px] font-semibold ${statusBarTheme.title}`}
                >
                  {statusBarTitle}
                </p>
                <span className="shrink-0 text-[11px] font-semibold text-paragraph/40">
                  #{order.orderNumber}
                </span>
              </div>
              {statusBarSubtitle && (
                <p className={`text-[13px] mt-0.5 ${statusBarTheme.sub}`}>
                  {statusBarSubtitle}
                </p>
              )}

              {/* Pickup row — clearly labeled so it's not mistaken for delivery */}
              {(pickupDate || slotLabel || timeRange) && (
                <div className="flex items-center gap-1.5 mt-2.5 pt-2.5 border-t border-black/5">
                  <CalendarClock size={13} className={statusBarTheme.icon} />
                  <span className="text-[12.5px] text-paragraph/70">
                    <span className="font-semibold text-paragraph/85">
                      Pickup:
                    </span>{" "}
                    {pickupDate}
                    {slotLabel ? ` · ${slotLabel}` : ""}
                    {timeRange ? ` (${timeRange})` : ""}
                  </span>
                </div>
              )}

              {/* Delivery row — separate line, same styling pattern as pickup */}
              {(deliveryDate || deliveryTime) && (
                <div className="flex items-center gap-1.5 mt-1.5">
                  <CalendarClock size={13} className={statusBarTheme.icon} />
                  <span className="text-[12.5px] text-paragraph/70">
                    <span className="font-semibold text-paragraph/85">
                      Delivery:
                    </span>{" "}
                    {deliveryDate}
                    {deliveryTime ? ` · ${deliveryTime}` : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Order progress — live orders only ───────────────────── */}
        {orderState === "live" && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-paragraph/8">
            <div className="px-4 pt-4 pb-1">
              <h3 className="text-[13px] uppercase tracking-widest font-semibold text-paragraph/40">
                Order progress
              </h3>
            </div>
            <div className="px-4 pb-4 pt-2">
              <OrderStepper
                status={order.status as OrderStatus}
                isPast={false}
                events={order.events ?? []}
                description={orderStatusInfo}
              />
            </div>
          </div>
        )}

        {/* ── Addresses ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-paragraph/8">
          <div className="px-4 pt-4 pb-1">
            <h3 className="text-[13px] uppercase tracking-widest font-semibold text-paragraph/40">
              Addresses
            </h3>
          </div>
          <div className="px-4 pb-4 pt-2">
            <div className="flex gap-3 items-start py-3 border-b border-paragraph/8">
              <div className="mt-0.5 p-1.5 rounded-lg bg-brand/8 shrink-0">
                <MapPin size={13} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-paragraph/40 font-medium">
                  Pickup address
                </p>
                <p className="text-[14px] text-paragraph mt-0.5">
                  {order.pickupAddress}
                </p>
              </div>
            </div>
            <div className="flex gap-3 items-start py-3">
              <div className="mt-0.5 p-1.5 rounded-lg bg-brand/8 shrink-0">
                <MapPin size={13} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] uppercase tracking-wide text-paragraph/40 font-medium">
                  Delivery address
                </p>
                <p className="text-[14px] text-paragraph mt-0.5">
                  {order.deliveryAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Items breakdown ─────────────────────────────────────── */}
        {(itemCount > 0 || order.bagCount) && (
          <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-paragraph/8">
            <div className="px-4 pt-4 pb-1">
              <h3 className="text-[13px] uppercase tracking-widest font-semibold text-paragraph/40">
                Items
              </h3>
            </div>

            <div className="px-4">
              {order.bagCount ? (
                <div className="flex items-center gap-3 py-3">
                  <Package size={14} className="text-paragraph/40" />
                  <span className="text-[14px]">
                    {order.bagCount} bag{order.bagCount !== 1 ? "s" : ""}
                  </span>
                </div>
              ) : (
                order.items?.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-center justify-between py-3 ${
                      idx < itemCount - 1 ? "border-b border-paragraph/8" : ""
                    }`}
                  >
                    <div>
                      <p className="text-[14px] font-medium">
                        {item.serviceItem?.item?.name ?? "Item"}
                      </p>
                      <p className="text-[12px] text-paragraph/50 mt-0.5">
                        {item.quantity} × GH₵
                        {Number(item.unitPriceAtOrder).toFixed(2)}
                      </p>
                    </div>
                    <span className="text-[14px] font-medium">
                      GH₵
                      {(Number(item.unitPriceAtOrder) * item.quantity).toFixed(
                        2,
                      )}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* ── Add-ons — only rendered if this order actually has any ── */}
            {addOnCount > 0 && (
              <div className="px-4 border-t border-paragraph/8 pt-1">
                <p className="text-[11px] uppercase tracking-wide text-paragraph/40 font-medium pt-3 pb-1">
                  Add-ons
                </p>
                {order.addOns!.map((addOn, idx) => (
                  <div
                    key={addOn.id}
                    className={`flex items-center justify-between py-3 ${
                      idx < addOnCount - 1 ? "border-b border-paragraph/8" : ""
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <p className="text-[14px] font-medium">
                        {addOn.serviceAddOn?.addOn?.name ?? "Add-on"}
                      </p>
                    </div>
                    <span className="text-[14px] font-medium">
                      GH₵{Number(addOn.priceAtOrder).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="border-t border-paragraph/8 mx-4 mt-1 pb-4 pt-3 flex flex-col gap-1.5">
              {addOnCount > 0 && (
                <div className="flex justify-between text-[13px] text-paragraph/60">
                  <span>Total Add-ons</span>
                  <span>GH₵{addOnsTotal.toFixed(2)}</span>
                </div>
              )}
              {deliveryFee > 0 && (
                <div className="flex justify-between text-[13px] text-paragraph/60">
                  <span>Delivery fee</span>
                  <span>GH₵{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-[13px] text-emerald-600">
                  <span>Discount</span>
                  <span>− GH₵{discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-[15px] font-bold mt-1">
                <span>Total</span>
                <span className="text-brand">GH₵{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── Rating — link only, delivered orders only ───────────── */}
        {orderState === "delivered" && (
          <Link
            href={`/order-detail/rate?oid=${order.id}`}
            className="flex items-center justify-between bg-white rounded-2xl px-4 py-3.5 shadow-sm border border-paragraph/8"
          >
            <div className="flex items-center gap-2.5">
              <Star size={16} className="text-brand" />
              <span className="text-[14px] font-medium text-paragraph">
                Rate this order
              </span>
            </div>
            <ArrowLeft size={14} className="rotate-180 text-paragraph/40" />
          </Link>
        )}

        {/* ── Support — secondary link, bottom of page ─────────────── */}
        <Link
          href="/support"
          className="text-center text-[13px] text-brand font-medium py-2"
        >
          Need help with this order? Contact support
        </Link>
      </div>

      {/* ── Floating primary action ──────────────────────────────── */}
      <div className="mt-4 px-5 fixed bottom-0 left-0 right-0 py-4 bg-white border-t border-paragraph/15">
        {orderState === "live" ? (
          <button className="w-full bg-brand flex items-center justify-center font-medium gap-2 py-3 rounded-full">
            <MessageSquare size={15} className="text-white" />
            <span className="text-white">Make a request</span>
          </button>
        ) : (
          <button className="w-full bg-brand flex items-center justify-center font-medium gap-2 py-3 rounded-full">
            <RefreshCcw size={18} className="text-white" />
            <span className="text-white">Reorder</span>
          </button>
        )}
      </div>
    </div>
  );
}
