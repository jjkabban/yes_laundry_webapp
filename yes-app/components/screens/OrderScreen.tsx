"use client";
import OrderStepper from "@/components/ui/OrdersStepper";
import { useOrderContext } from "@/context/OrderContext";
import { getOrderStatusInfo, ORDER_STATUS_CONFIG } from "@/helpers/status";
import {
  formatDate,
  formatOrderTime,
  formatOrderWindowTime,
} from "@/utils/datetime";
import {
  CalendarClock,
  MapPin,
  MessageSquare,
  RefreshCcw,
  Star,
  WashingMachine,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

type FilterTab = "all" | "ongoing" | "completed" | "cancelled";

export default function OrderScreen() {
  const { orderData: orders, isOrdersLoading } = useOrderContext();
  const [activeTab, setActiveTab] = useState<FilterTab>("all");

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
    <div className="h-screen pb-6 fixed overflow-y-scroll overflow-x-hidden w-full max-w-2/5">
      <div className="p-4 pb-2 fixed max-w-[375] w-full z-20 bg-foreground shadow-sm leading-tight">
        <h1 className="text-xl font-bold">My Orders</h1>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide mt-4 pb-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`shrink-0 px-3 grow py-1.5 rounded-full text-xs font-medium transition-colors ${
                activeTab === tab.key
                  ? "bg-brand text-white"
                  : "bg-paragraph/8 text-paragraph/70"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {orders?.length === 0 ? (
        <div className="flex items-center justify-center flex-col h-full">
          <WashingMachine size={30} />
          <h2 className="text-xl font-medium pt-2">Ready for fresh loads?</h2>
          <button className="mt-5 bg-brand text-white px-8 py-2 rounded-xl w-1/2">
            Explore services
          </button>
        </div>
      ) : (
        <div className="pt-30 flex flex-col gap-9">
          {/* Ongoing */}
          {showOngoing && (displayOrders.live?.length ?? 0) > 0 && (
            <div>
              <h3 className="self-start px-5 py-2 text-md font-medium">
                Ongoing orders
              </h3>

              <div className="flex flex-col items-center w-full gap-4">
                {displayOrders.live?.map((ord, index) => {
                  const timestamp = formatDate(ord.createdAt);
                  const orderType = ord.bagCount
                    ? `${ord.bagCount} bag${ord.bagCount > 1 ? "s" : ""}`
                    : ord.items.length > 0
                      ? `${ord.items.length} item${ord.items.length > 1 ? "s" : ""} picked`
                      : null;
                  const isCancelled = ord.status === "CANCELLED";
                  const status = ORDER_STATUS_CONFIG[ord.status];
                  const orderStatusInfo = getOrderStatusInfo(
                    ord.status,
                    ord.events,
                  );

                  return (
                    <div
                      key={ord.id + index}
                      className="px-4 bg-white py-3 rounded-xl shadow-sm shrink-0 grow
                               w-[92vw] sm:w-[70vw] md:w-[340] snap-start border-[1] border-paragraph/30"
                    >
                      <div>
                        <div className="flex-row flex items-start justify-between border-b-[1] py-2 border-paragraph/10">
                          <div className="flex-row flex items-center gap-2">
                            <div className="relative h-10 w-10 overflow-hidden rounded-sm">
                              <Image
                                src={"/images/order_img.jpg"}
                                fill
                                alt="order_image"
                                className="object-fill"
                              />
                            </div>
                            <div className="leading-5">
                              <h3 className="font-medium text-[15px] leading-tight">
                                {ord.service?.name ?? "Standard wash"}
                              </h3>
                              <div className="flex flex-col leading-4">
                                <span className="text-[13px]">
                                  {orderType} &middot; {timestamp}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium">
                            <span className="text-yellow-700">
                              Order #{ord.orderNumber}
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 pb-2 flex flex-col leading-6">
                          <span className="text-[14px]  font-medium">
                            {status.title}
                          </span>
                        </div>
                      </div>

                      <div className="py-2">
                        <OrderStepper
                          status={ord.status}
                          cancelled={isCancelled}
                          isPast={false}
                          description={orderStatusInfo}
                        />
                      </div>

                      <div className="flex items-center justify-between gap-1 pt-2 px-1 border-t-[1] border-paragraph/10 mt-2 text-paragraph/60">
                        <div className="flex items-center  gap-1">
                          <MapPin size={12} />
                          <span className="text-[13px] border-b-[2] border-paragraph/30">
                            {ord.deliveryAddress}
                          </span>
                        </div>

                        <div className="flex items-center">
                          <span className="text-[12px] text-brand font-semibold">
                            {formatOrderWindowTime(
                              ord.deliveryWindow as string,
                              false,
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Completed + Cancelled */}
          {(showCompleted || showCancelled) &&
            (filteredPast?.length ?? 0) > 0 && (
              <div>
                <h3 className="self-start px-5 py-2 text-md font-medium">
                  {activeTab === "cancelled"
                    ? "Cancelled orders"
                    : "Completed orders"}
                </h3>

                <div className="flex flex-col items-center w-full gap-4">
                  {filteredPast?.map((ord, index) => {
                    const reviewed = false;
                    const orderType = ord.bagCount
                      ? `${ord.bagCount} bag${ord.bagCount > 1 ? "s" : ""}`
                      : ord.items.length > 0
                        ? `${ord.items.length} item${ord.items.length > 1 ? "s" : ""} washed`
                        : null;
                    const isCancelled = ord.status === "CANCELLED";
                    const status = ORDER_STATUS_CONFIG[ord.status];
                    const cancelReason =
                      ord.events?.findLast((e) => e.eventType === "CANCELLED")
                        ?.notes ?? "Order was cancelled";

                    return (
                      <div
                        key={ord.id + index}
                        className="px-4 bg-white py-3 rounded-xl shadow-sm shrink-0 grow
                          w-[92vw] sm:w-[70vw] md:w-[340] snap-start border-[1] border-paragraph/30"
                      >
                        {/* Card header */}
                        <div className="flex-row flex items-start justify-between border-b-[1] py-2 border-paragraph/10">
                          <div className="flex-row flex items-center gap-2">
                            <div
                              className={`relative h-10 w-10 overflow-hidden rounded-sm ${isCancelled ? "opacity-40" : ""}`}
                            >
                              <Image
                                src={"/images/order_img.jpg"}
                                fill
                                alt="order_image"
                                className="object-fill"
                              />
                            </div>
                            <div className="leading-5">
                              <h3
                                className={`font-medium text-[15px] leading-tight ${isCancelled ? "text-paragraph/50" : ""}`}
                              >
                                {ord.service?.name ?? "Standard wash"}
                              </h3>
                              <div className="flex flex-col leading-4">
                                <span className="text-[13px] text-paragraph/60">
                                  {orderType} &middot; GH₵{" "}
                                  {ord.total.toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium">
                            {isCancelled ? (
                              <span className="text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                                Cancelled
                              </span>
                            ) : (
                              <span className="text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded-full font-medium">
                                Delivered
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cancelled body */}
                        {isCancelled ? (
                          <>
                            <div className="flex justify-between items-center pt-2 px-1 mt-1">
                              <span className="text-[13px] text-red-600 font-medium flex-1 pr-4">
                                {cancelReason}
                              </span>
                              <span className="text-[12px] text-paragraph/40 shrink-0">
                                {formatDate(ord.updatedAt)}
                              </span>
                            </div>

                            <div className="flex justify-between px-1 pt-3 border-t-[1] mt-3 border-paragraph/20">
                              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md border-[1] border-black/20">
                                <MessageSquare size={14} color="#444" />
                                <button className="text-sm text-paragraph">
                                  Contact support
                                </button>
                              </div>
                              <button className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md border-[1] border-black/20">
                                <RefreshCcw
                                  size={14}
                                  className="text-paragraph/70"
                                />
                                <span className="text-sm text-paragraph">
                                  Reorder
                                </span>
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* Delivered body */}
                            <div className="flex gap-2 justify-between items-center pt-1 px-2 mt-2">
                              <div className="flex items-center gap-1">
                                <MapPin size={16} />
                                <span className="text-[13px]">
                                  {ord.deliveryAddress}
                                </span>
                              </div>
                              <span className="text-[13px] font-semibold">
                                {formatOrderTime(ord.createdAt, false)}
                              </span>
                            </div>

                            <div className="flex justify-between px-1 pt-4 border-t-[1] mt-3 border-paragraph/20">
                              {reviewed ? (
                                <div className="flex gap-1 items-center">
                                  <Star
                                    size={14}
                                    color="#b8964e"
                                    fill="#b8964e"
                                  />
                                  <span>4.8</span>
                                </div>
                              ) : (
                                <button className="text-brand font-semibold">
                                  Leave a review
                                </button>
                              )}
                              <button className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded-md border-[1] border-black/20">
                                <RefreshCcw
                                  size={14}
                                  className="text-paragraph/70"
                                />
                                <span className="text-sm text-paragraph">
                                  Reorder
                                </span>
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          <div className="flex items-center justify-center flex-col">
            <CalendarClock size={30} />
            <h2 className="text-xl font-medium pt-2">Next pickup today?</h2>
            <button className="mt-5 bg-brand text-white px-8 py-2 rounded-xl w-1/2">
              Explore services
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
