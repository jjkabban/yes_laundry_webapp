"use client";
import { Order } from "@/context/types/order";
import OrdersStepper from "../ui/OrdersStepper";
import { formatDate, formatOrderTime } from "@/utils/datetime";
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
              key={ord.id + index}
              className="px-4 bg-white py-3 rounded-xl shadow-sm shrink-0
                w-[85vw] sm:w-[70vw] md:w-[340] snap-start"
            >
              <div>
                <div className="flex-row flex items-start justify-between border-b-[1] py-2 border-paragraph/10">
                  <div className="flex-row flex items-center gap-2 ">
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

                  <div
                    className={`flex flex-col items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-medium ${status.text}`}
                  >
                    <span className="text-yellow-700">
                      Order #{ord.orderNumber}
                    </span>
                    {ord.status === "CANCELLED" && <span>Cancelled</span>}
                  </div>
                </div>

                <div className="pt-4 pb-2 flex flex-col leading-6">
                  <span className="text-[18px] font-medium">
                    {status.title}
                  </span>
                  <span className="text-[14px] text-paragraph/80">
                    {status.extraInfo}
                  </span>
                </div>
              </div>

              <div className="py-2">
                <OrdersStepper
                  status={ord.status}
                  cancelled={isCancelled}
                  isPast={false}
                  orientation="horizontal"
                />
              </div>

              {/* <div className="flex gap-2 justify-between items-center pt-2 px-2 border-t-[1] border-paragraph/30 mt-2">
                <span className="text-[13px]">{status.pastInfo}</span>
                <span className="text-[13px]">
                  {formatOrderTime(ord.createdAt, false)}
                </span>
              </div> */}
            </div>
          );
        })}
      </div>
    </div>
  );
}
