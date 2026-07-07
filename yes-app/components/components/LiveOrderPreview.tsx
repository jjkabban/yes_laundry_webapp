"use client";
import { Order } from "@/types/shared/order.type";
import OrdersStepper from "../ui/OrdersStepper";
import { formatDate } from "@/utils/datetime";
import { getOrderStatusInfo, ORDER_STATUS_CONFIG } from "@/helpers/status";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { useRouter } from "next/navigation";
import Icon from "../icons/LucideIcons";

type Props = {
  orders: Order[] | null;
};

export default function LiveOrderPreview({ orders }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const router = useRouter();

  const displayOrders = useMemo(() => {
    return { toDisplay: orders, length: orders?.length };
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
      <div className="flex-row flex justify-between items-center mb-3 px-5">
        <div>
          <h3 className="font-semibold text-[18px] leading-tight">
            Ongoing orders
          </h3>
        </div>

        {(displayOrders?.length ?? 0) > 3 ? (
          <button
            onClick={() => {
              router.push(`/order-detail`);
            }}
            className="text-[13.5px] text-brand font-semibold md:hidden"
          >
            See all
          </button>
        ) : null}

        <div className="hidden md:flex items-center gap-1.5">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-paragraph/12 bg-white shadow-sm hover:border-brand/30 disabled:opacity-30 transition-all"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="h-8 w-8 flex items-center justify-center rounded-full border border-paragraph/12 bg-white shadow-sm hover:border-brand/30 disabled:opacity-30 transition-all"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>

      {/* Scrollable row */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="flex ml-6 flex-row gap-3.5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none px-5"
      >
        {displayOrders?.toDisplay?.map((ord, index) => {
          const timestamp = formatDate(ord.createdAt);
          const itemCount = ord.items?.length ?? 0;
          const orderType =
            ord.bagCount != null
              ? `${ord.bagCount} bag${ord.bagCount !== 1 ? "s" : ""}`
              : itemCount > 0
                ? `${itemCount} item${itemCount !== 1 ? "s" : ""}`
                : null;
          const isCancelled = ord.status === "CANCELLED";
          const status = ORDER_STATUS_CONFIG[ord.status];
          const orderStatusInfo = getOrderStatusInfo(ord.status, ord.events);

          return (
            <div
              key={ord.id + index}
              onClick={() => {
                router.push(`/order-detail?oid=${ord.id}`);
              }}
              className="group bg-white rounded-2xl shadow-[0_8px_24px_-14px_rgba(10,25,41,0.25)] shrink-0
                w-[85vw] sm:w-[70vw] md:w-[340px] snap-start border border-paragraph/8 overflow-hidden
                cursor-pointer transition-all duration-300 hover:shadow-[0_12px_28px_-12px_rgba(10,25,41,0.3)] hover:-translate-y-0.5 "
            >
              <div className="p-4">
                {/* Top row: image, service, order number badge */}
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-paragraph/8">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="relative flex items-center justify-center h-11 w-11 shrink-0 overflow-hidden rounded-lg bg-brand/8">
                      <Icon
                        name={
                          (ord.service?.icon as keyof typeof Icon) ??
                          "WashingMachine"
                        }
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-[14.5px] leading-tight truncate">
                        {ord.service?.name ?? "Standard wash"}
                      </h3>
                      <span className="text-[12.5px] text-[#8a92a0]">
                        {orderType ? `${orderType} · ${timestamp}` : timestamp}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-brand/8 px-2.5 py-1 text-[11px] font-semibold text-brand">
                    #{ord.orderNumber}
                  </span>
                </div>

                {/* Stepper */}
                <div className="pt-3">
                  <OrdersStepper
                    status={ord.status}
                    cancelled={isCancelled}
                    isPast={false}
                    description={orderStatusInfo}
                  />
                </div>
              </div>

              {/* Accent underline, matches ServiceList's signature detail */}
              <div className="h-[3px] bg-gradient-to-r from-brand to-emerald-500 w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
