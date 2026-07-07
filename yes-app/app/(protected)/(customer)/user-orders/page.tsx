"use client";
import OrderStepper from "@/components/ui/OrdersStepper";
import { useOrderContext } from "@/context/OrderContext";
import { ORDER_STATUS_CONFIG } from "@/helpers/status";
import {
  formatDate,
  formatOrderTime,
  formatOrderWindowTime,
} from "@/utils/datetime";
import {
  CalendarClock,
  ChevronRight,
  MapPin,
  MessageSquare,
  RefreshCcw,
  Star,
  WashingMachine,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Icon from "@/components/icons/LucideIcons";

type FilterTab = "all" | "ongoing" | "completed" | "cancelled";

export default function OrdersHomePage() {
  const { orderData: orders, isOrdersLoading } = useOrderContext();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const router = useRouter();
  const params = useSearchParams();
  const tab = params.get("tab");

  const displayOrders = useMemo(() => {
    const hiddenStatuses = ["DELIVERED", "CANCELLED"];
    const live = orders?.filter((ord) => !hiddenStatuses.includes(ord.status));
    const delivered = orders?.filter((ord) => ord.status === "DELIVERED");
    const cancelled = orders?.filter((ord) => ord.status === "CANCELLED");
    const past = orders?.filter((ord) => hiddenStatuses.includes(ord.status));

    const liveLen = (live?.length ?? 0) > 5 ? "5+" : (live?.length ?? 0);
    const deliveredLen =
      (delivered?.length ?? 0) > 5 ? "5+" : (delivered?.length ?? 0);
    const cancelledLen =
      (cancelled?.length ?? 0) > 5 ? "5+" : (cancelled?.length ?? 0);

    return {
      live,
      past,
      delivered,
      cancelled,
      liveLen,
      deliveredLen,
      cancelledLen,
    };
  }, [orders]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "ongoing", label: `Ongoing (${displayOrders.liveLen})` },
    { key: "completed", label: `Delivered (${displayOrders.deliveredLen})` },
    { key: "cancelled", label: `Cancelled (${displayOrders.cancelledLen})` },
  ];

  useEffect(() => {
    if (tab) {
      setActiveTab(tab as FilterTab);
    }
  }, [tab]);
  const showOngoing = activeTab === "all" || activeTab === "ongoing";
  const showCompleted = activeTab === "all" || activeTab === "completed";
  const showCancelled = activeTab === "cancelled";

  const filteredPast =
    activeTab === "cancelled"
      ? displayOrders.cancelled
      : activeTab === "completed"
        ? displayOrders.delivered
        : displayOrders.past;

  return (
    <div className="relative pb-36 bg-[#fafafa] min-h-screen">
      {/* Header */}
      <div className="p-4 pb-3 fixed top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-md border-b border-paragraph/6 leading-tight">
        <h1 className="text-[26px] font-bold tracking-tight text-zinc-900">
          My Orders
        </h1>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`shrink-0 px-4 py-2 rounded-full text-[12.5px] font-semibold whitespace-nowrap transition-all duration-200 ${
                activeTab === t.key
                  ? "bg-brand text-white shadow-[0_4px_12px_-4px_rgba(184,150,78,0.5)]"
                  : "bg-zinc-100 text-zinc-500 hover:bg-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-32">
        {orders?.length === 0 ? (
          <div className="flex items-center justify-center flex-col h-screen px-6 text-center">
            <div className="h-16 w-16 rounded-full bg-brand/8 flex items-center justify-center mb-4">
              <WashingMachine size={26} className="text-brand" />
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">
              Ready for fresh loads?
            </h2>
            <p className="text-[13.5px] text-zinc-400 mt-1">
              You haven't placed any orders yet.
            </p>
            <button
              className="mt-6 bg-brand text-white px-8 py-3 rounded-full font-semibold text-[14px] shadow-[0_8px_20px_-8px_rgba(184,150,78,0.6)] hover:opacity-90 transition-opacity"
              onClick={() => router.push(`select-service`)}
            >
              Explore services
            </button>
          </div>
        ) : (
          <div className=" flex flex-col gap-8 px-4">
            {/* ── Ongoing ─────────────────────────────────────── */}
            {showOngoing && (displayOrders.live?.length ?? 0) > 0 && (
              <div>
                <h3 className="self-start px-1 pb-3 text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                  Ongoing orders
                </h3>

                <div className="flex flex-col gap-3.5">
                  {displayOrders.live?.map((ord, index) => {
                    const timestamp = formatDate(ord.createdAt);
                    const orderType = ord.bagCount
                      ? `${ord.bagCount} bag${ord.bagCount > 1 ? "s" : ""}`
                      : ord.items.length > 0
                        ? `${ord.items.length} item${ord.items.length > 1 ? "s" : ""} picked`
                        : null;
                    const isCancelled = ord.status === "CANCELLED";
                    const status = ORDER_STATUS_CONFIG[ord.status];

                    return (
                      <div
                        onClick={() =>
                          router.push(`order-detail?oid=${ord.id}`)
                        }
                        key={ord.id + index}
                        className="bg-white rounded-2xl shadow-[0_6px_20px_-12px_rgba(10,25,41,0.18)]
                        border border-paragraph/6 overflow-hidden cursor-pointer
                        transition-all duration-300 hover:shadow-[0_10px_26px_-10px_rgba(10,25,41,0.22)] hover:-translate-y-0.5"
                      >
                        <div className="p-4">
                          {/* Header row */}
                          <div className="flex items-start justify-between gap-2 pb-3 border-b border-paragraph/6">
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="h-11 w-11 shrink-0 flex items-center justify-center rounded-xl bg-brand/8">
                                <Icon
                                  name={
                                    (ord.service?.icon ??
                                      "WashingMachine") as keyof typeof Icon
                                  }
                                  size={20}
                                  strokeWidth={2}
                                  className="text-brand"
                                />
                              </div>
                              <div className="min-w-0">
                                <h3 className="font-semibold text-[14.5px] leading-tight text-zinc-900 truncate">
                                  {ord.service?.name ?? "Standard wash"}
                                </h3>
                                <span className="text-[12.5px] text-zinc-400">
                                  {orderType
                                    ? `${orderType} · ${timestamp}`
                                    : timestamp}
                                </span>
                              </div>
                            </div>

                            <span className="shrink-0 rounded-full bg-brand/8 px-2.5 py-1 text-[11px] font-semibold text-brand">
                              #{ord.orderNumber}
                            </span>
                          </div>

                          {/* Status title */}
                          <div className="pt-3 pb-1">
                            <span className="text-[16px] font-semibold text-zinc-900 leading-tight">
                              {status.title}
                            </span>
                          </div>

                          {/* Stepper */}
                          <div className="pt-2">
                            <OrderStepper
                              status={ord.status}
                              cancelled={isCancelled}
                              isPast={false}
                            />
                          </div>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between gap-2 px-4 py-3 bg-zinc-50/60 border-t border-paragraph/6">
                          <div className="flex items-center gap-1.5 min-w-0 text-zinc-500">
                            <MapPin size={13} className="shrink-0" />
                            <span className="text-[12.5px] truncate">
                              {ord.deliveryAddress}
                            </span>
                          </div>
                          <span className="shrink-0 text-[12px] font-semibold text-brand">
                            {formatOrderWindowTime(
                              ord.deliveryWindow as string,
                              false,
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Completed + Cancelled ───────────────────────── */}
            {(showCompleted || showCancelled) &&
              (filteredPast?.length ?? 0) > 0 && (
                <div>
                  <h3 className="self-start px-1 pb-3 text-[13px] font-semibold uppercase tracking-wide text-zinc-400">
                    {activeTab === "cancelled"
                      ? "Cancelled orders"
                      : "Completed orders"}
                  </h3>

                  <div className="flex flex-col gap-3.5">
                    {filteredPast?.map((ord, index) => {
                      const reviewed = false;
                      const orderType = ord.bagCount
                        ? `${ord.bagCount} bag${ord.bagCount > 1 ? "s" : ""}`
                        : ord.items.length > 0
                          ? `${ord.items.length} item${ord.items.length > 1 ? "s" : ""} washed`
                          : null;
                      const isCancelled = ord.status === "CANCELLED";
                      const cancelReason =
                        ord.events?.findLast((e) => e.eventType === "CANCELLED")
                          ?.notes ?? "Order was cancelled";

                      return (
                        <div
                          onClick={() =>
                            router.push(`order-detail?oid=${ord.id}`)
                          }
                          key={ord.id + index}
                          className="bg-white rounded-2xl shadow-[0_6px_20px_-12px_rgba(10,25,41,0.14)]
                          border border-paragraph/6 overflow-hidden cursor-pointer
                          transition-all duration-300 hover:shadow-[0_10px_26px_-10px_rgba(10,25,41,0.2)]"
                        >
                          <div className="p-4">
                            {/* Header row */}
                            <div className="flex items-start justify-between gap-2 pb-3 border-b border-paragraph/6">
                              <div className="flex items-center gap-3 min-w-0">
                                <div
                                  className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-xl ${
                                    isCancelled ? "bg-red-50" : "bg-emerald-50"
                                  }`}
                                >
                                  <Icon
                                    name={
                                      (ord.service?.icon ??
                                        "WashingMachine") as keyof typeof Icon
                                    }
                                    size={20}
                                    strokeWidth={2}
                                    className={
                                      isCancelled
                                        ? "text-red-400"
                                        : "text-emerald-600"
                                    }
                                  />
                                </div>
                                <div className="min-w-0">
                                  <h3
                                    className={`font-semibold text-[14.5px] leading-tight truncate ${
                                      isCancelled
                                        ? "text-zinc-400"
                                        : "text-zinc-900"
                                    }`}
                                  >
                                    {ord.service?.name ?? "Standard wash"}
                                  </h3>
                                  <span className="text-[12.5px] text-zinc-400">
                                    {orderType} · GH₵ {ord.total.toFixed(2)}
                                  </span>
                                </div>
                              </div>

                              <span
                                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                                  isCancelled
                                    ? "bg-red-50 text-red-600"
                                    : "bg-emerald-50 text-emerald-700"
                                }`}
                              >
                                {isCancelled ? "Cancelled" : "Delivered"}
                              </span>
                            </div>

                            {isCancelled ? (
                              <>
                                <div className="flex items-start justify-between gap-3 pt-3">
                                  <p className="text-[13px] w-2/3 leading-snug text-red-600/90">
                                    {cancelReason}
                                  </p>
                                  <span className="shrink-0 text-[11.5px] text-zinc-400">
                                    {formatDate(ord.updatedAt)}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-paragraph/6">
                                  <button className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[12.5px] font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
                                    <MessageSquare size={13} />
                                    Contact support
                                  </button>
                                  <button className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[12.5px] font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
                                    <RefreshCcw size={13} />
                                    Reorder
                                  </button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex items-center justify-between gap-2 pt-3">
                                  <div className="flex items-center gap-1.5 text-zinc-500 min-w-0">
                                    <MapPin size={13} className="shrink-0" />
                                    <span className="text-[12.5px] truncate">
                                      {ord.deliveryAddress}
                                    </span>
                                  </div>
                                  <span className="shrink-0 text-[12px] font-semibold text-zinc-600">
                                    {formatOrderTime(ord.createdAt, false)}
                                  </span>
                                </div>

                                <div className="flex items-center justify-between gap-2 pt-3 mt-3 border-t border-paragraph/6">
                                  {reviewed ? (
                                    <div className="flex items-center gap-1">
                                      <Star
                                        size={14}
                                        className="fill-brand text-brand"
                                      />
                                      <span className="text-[13px] font-semibold text-zinc-700">
                                        4.8
                                      </span>
                                    </div>
                                  ) : (
                                    <button className="flex items-center gap-1 text-[13px] font-semibold text-brand">
                                      Leave a review
                                      <ChevronRight size={14} />
                                    </button>
                                  )}
                                  <button className="flex items-center gap-1.5 rounded-lg bg-zinc-50 px-3 py-1.5 text-[12.5px] font-medium text-zinc-600 hover:bg-zinc-100 transition-colors">
                                    <RefreshCcw size={13} />
                                    Reorder
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            {/* CTA footer */}
            <div className="flex items-center justify-center flex-col py-8 text-center">
              <div className="h-14 w-14 rounded-full bg-brand/8 flex items-center justify-center mb-3">
                <CalendarClock size={24} className="text-brand" />
              </div>
              <h2 className="text-lg font-semibold text-zinc-900">
                Next pickup today?
              </h2>
              <button
                className="mt-4 bg-brand text-white px-8 py-3 rounded-full font-semibold text-[14px] shadow-[0_8px_20px_-8px_rgba(184,150,78,0.6)] hover:opacity-90 transition-opacity"
                onClick={() => router.push(`select-service`)}
              >
                Explore services
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
