"use client";
import { Order } from "@/context/types/order";
import OrdersStepper from "../ui/OrdersStepper";
import { formatOrderTime } from "@/utils/datetime";
import { ORDER_STATUS_CONFIG } from "@/helpers/status";
import { useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  orders: Order[];
};

export default function LiveOrderPreview({ orders }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const displayOrders = useMemo(() => {
    return { toDisplay: orders, length: orders.length };
  }, [orders]);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (!container) return;
    const scrollAmount = container.offsetWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const onScroll = () => {
    const container = scrollRef.current;
    if (!container) return;
    setCanScrollLeft(container.scrollLeft > 0);
    setCanScrollRight(
      container.scrollLeft + container.offsetWidth < container.scrollWidth - 4,
    );
  };

  return (
    <div className="flex flex-col my-2">
      {/* Header */}
      <div className="flex-row flex justify-between items-center mb-2 px-5">
        <h3 className="font-semibold text-md">Ongoing orders</h3>

        {/* mobile: see all | md: arrow controls */}
        {displayOrders.length > 3 ? (
          <span className="text-[14px] text-brand/90 font-semibold md:hidden">
            see all
          </span>
        ) : null}

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm disabled:opacity-30 transition-opacity"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-7 w-7 flex items-center justify-center rounded-full border border-zinc-200 bg-white shadow-sm disabled:opacity-30 transition-opacity"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex flex-row gap-3 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none px-5 ml-4"
      >
        {displayOrders.toDisplay.map((ord, index) => {
          const timestamp = formatOrderTime(
            ord.createdAt ?? new Date().toISOString(),
            false,
          );
          const orderType = ord.bagCount
            ? `${ord.bagCount} bag${ord.bagCount > 1 ? "s" : ""}`
            : ord.items.length > 0
              ? `${ord.items.length} item${ord.items.length > 1 ? "s" : ""}`
              : null;
          const isCancelled = ord.status === "CANCELLED";
          const config = ORDER_STATUS_CONFIG[ord.status];

          return (
            <div
              key={ord.id + index}
              className="px-4 bg-white py-3 rounded-xl shadow-sm shrink-0
                w-[85vw] sm:w-[70vw] md:w-[340] snap-start"
            >
              <div>
                <div className="flex-row flex items-start justify-between">
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
                      <h3 className="font-semibold text-[14px] leading-tight">
                        {ord.service?.name ?? "Standard wash"}
                      </h3>
                      <span className="text-[12px]">GHS {ord.total}</span>
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${config.text} ${config.bg}`}
                  >
                    <span
                      className={`h-1.5 w-1.5 ${config.dot} rounded-full`}
                    />
                    <span>{config.label}</span>
                  </div>
                </div>

                <div className="py-2">
                  <span className="text-[13px] text-paragraph/80">
                    {timestamp} &middot; {orderType} picked up
                  </span>
                </div>

                <div className="py-2 flex flex-row justify-between">
                  <span className="text-[14px]">
                    {ORDER_STATUS_CONFIG[ord.status ?? "CONFIRMED"].label}
                  </span>
                  <span className="text-sm text-brand">
                    {formatOrderTime(new Date().toISOString(), false)}
                  </span>
                </div>
              </div>

              <OrdersStepper
                status={ord.status}
                cancelled={isCancelled}
                isPast={false}
                orientation="horizontal"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
