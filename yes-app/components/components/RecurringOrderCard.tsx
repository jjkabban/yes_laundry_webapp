"use client";

import { Calendar, MapPin, ShoppingBag } from "lucide-react";
import { Order, RecurrenceFrequency } from "@/types/shared/order.type";
import RecurringOrderActions from "./RecurringActionRow";

export interface RecurringOrder extends Order {
  recurrence: {
    frequency: RecurrenceFrequency;
    nextDeliveryDate: string;
    lastProcessedDate?: string;
    startDate: string;
    endDate?: string;
    isActive: boolean;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
  scheduledOrders: {
    id: string;
    scheduledFor: string;
    status: "PENDING" | "PROCESSED" | "SKIPPED" | "CANCELLED";
  }[];
}

export type EditTarget = "items" | "pickup" | "delivery" | "stop" | null;

const frequencyLabels: Record<RecurrenceFrequency, string> = {
  WEEKLY: "Weekly",
  BIWEEKLY: "Bi-weekly",
  MONTHLY: "Monthly",
};

function formatNextDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

type Props = {
  order: RecurringOrder;
  editMode: boolean;
  onOpenEditor: (target: EditTarget) => void;
};

export default function RecurringOrderCard({
  order,
  editMode,
  onOpenEditor,
}: Props) {
  const isPaused = !order.recurrence.isActive;
  const itemCount = order.items.reduce((sum, it) => sum + it.quantity, 0);

  return (
    <div
      className={`bg-white rounded-2xl border overflow-hidden
        ${isPaused ? "border-paragraph/8 opacity-60" : "border-paragraph/8"}`}
    >
      {/* top row: service name + frequency badge */}
      <div className="flex items-center justify-between px-4 pt-4 pb-1">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-[15px] font-semibold text-paragraph truncate">
            {order.service?.name ?? "Standard wash"}
          </h2>
          <span className="text-[10px] font-medium text-paragraph/40">
            #{order.orderNumber}
          </span>
        </div>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-[11px] font-medium
            ${isPaused ? "bg-paragraph/8 text-paragraph/50" : "bg-brand/10 text-brand"}`}
        >
          {isPaused ? "Paused" : frequencyLabels[order.recurrence.frequency]}
        </span>
      </div>

      {/* next pickup highlight */}
      <div className="mx-4 mt-2 mb-3 rounded-xl bg-brand/5 border border-brand/10 px-3 py-3 flex items-center gap-3">
        <div className="p-2 rounded-lg bg-brand/10 shrink-0">
          <Calendar size={15} color="#b8964e" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[11px] uppercase tracking-wide text-paragraph/40 font-medium">
            {isPaused ? "Resumes" : "Next pickup"}
          </p>
          <p className="text-[14px] font-semibold text-paragraph mt-0.5">
            {formatNextDate(order.recurrence.nextDeliveryDate)}
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] text-paragraph/40">Session</p>
          <p className="text-[12px] font-medium text-paragraph mt-0.5">
            {order.pickupWindow}
          </p>
        </div>
      </div>

      {/* stats row: items + address + price */}
      <div className="px-4 flex items-center gap-4 pb-3">
        <div className="flex items-center gap-1.5">
          <ShoppingBag size={13} className="text-paragraph/40" />
          <span className="text-[13px] text-paragraph/70">
            {itemCount} item{itemCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin size={13} className="text-paragraph/40" />
          <span className="text-[13px] text-paragraph/70 truncate max-w-[140px]">
            {order.pickupAddress.split(",")[0]}
          </span>
        </div>
        <div className="ml-auto text-[14px] font-bold text-brand">
          GH₵{order.total.toFixed(2)}
        </div>
      </div>

      {/* edit action row */}
      <RecurringOrderActions
        visible={editMode}
        isPaused={isPaused}
        onItems={() => onOpenEditor("items")}
        onPickup={() => onOpenEditor("pickup")}
        onDelivery={() => onOpenEditor("delivery")}
        onStop={() => onOpenEditor("stop")}
      />
    </div>
  );
}
