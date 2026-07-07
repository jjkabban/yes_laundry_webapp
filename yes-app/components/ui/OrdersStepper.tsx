"use client";

import { Fragment } from "react";
import { cn } from "@/lib/utils/cn";
import {
  LiveOrderEvent,
  OrderEventType,
  OrderStatus,
} from "@/types/shared/order.type";
import { formatOrderTime } from "@/utils/datetime";
import Icon from "../icons/LucideIcons";

type DisplayStep = 1 | 2 | 3 | 4;

const ORDER_STEPS: { step: DisplayStep; label: string }[] = [
  { step: 1, label: "Picked up" },
  { step: 2, label: "Washing" },
  { step: 3, label: "Ready" },
  { step: 4, label: "Delivered" },
];

const STEPS_ICON: Record<number, string> = {
  1: "Truck",
  2: "WashingMachine",
  3: "Shirt",
  4: "Building2",
};

const STEP_EVENTS: Record<DisplayStep, OrderEventType[]> = {
  1: ["PICKED_UP"],
  2: ["PROCESSING_STARTED", "PROFESSIONAL_CLEANING"],
  3: ["READY"],
  4: ["OUT_FOR_DELIVERY", "DELIVERED", "PAYMENT_RECEIVED"],
};

export function getDisplayStep(status: OrderStatus): DisplayStep {
  switch (status) {
    case "PICKED_UP":
      return 1;
    case "IN_PROGRESS":
      return 2;
    case "READY":
    case "OUT_FOR_DELIVERY":
      return 3;
    case "DELIVERED":
      return 4;
    default:
      return 1;
  }
}

export function getEventsForStep(
  events: LiveOrderEvent[],
  step: DisplayStep,
): LiveOrderEvent[] {
  return events.filter((e) => STEP_EVENTS[step].includes(e.eventType));
}

function StepDot({
  state,
  number,
}: {
  state: "done" | "active" | "pending";
  number: number;
}) {
  const iconName = STEPS_ICON[number];

  return (
    <div
      className={cn(
        "flex h-8 w-8 relative shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
        state === "done" && "bg-emerald-600 text-white",
        (state === "pending" || state === "active") &&
          "border border-zinc-200 bg-zinc-100 text-black/70",
      )}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Icon
          name={iconName as keyof typeof Icon}
          size={18}
          strokeWidth={2.4}
        />
      </div>

      {state === "active" && (
        <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      )}
    </div>
  );
}

// ─── Cancelled state ──────────────────────────────────────────────────────────

function CancelledState({
  events,
  isPast,
  className,
}: {
  events?: LiveOrderEvent[];
  isPast: boolean;
  className?: string;
}) {
  const cancelledEvent = events?.find((e) => e.status === "CANCELLED");
  const timestamp = cancelledEvent
    ? formatOrderTime(cancelledEvent.createdAt, isPast)
    : null;
  const reason = cancelledEvent?.notes;

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4",
        className,
      )}
    >
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
        <Icon name="X" size={18} strokeWidth={2.5} className="text-red-600" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[14.5px] font-semibold text-red-700">
            Order cancelled
          </p>
          {timestamp && (
            <span className="shrink-0 text-[11.5px] font-medium text-red-500/70">
              {timestamp}
            </span>
          )}
        </div>

        <p className="mt-1 text-[13px] leading-snug text-red-600/80">
          {reason ??
            "This order was cancelled. Any payment made has been refunded."}
        </p>

        <button
          type="button"
          onClick={() => {}}
          className="mt-2.5 inline-flex items-center gap-1 text-[12.5px] font-semibold text-red-700 hover:text-red-800 transition-colors"
        >
          Contact support
          <Icon name="ChevronRight" size={13} strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface OrderStepperProps {
  status: OrderStatus;
  isPast: boolean;
  description?: {
    past: string | null;
    current: string;
    timestamp: string | null;
  };
  events?: LiveOrderEvent[];
  cancelled?: boolean;
  className?: string;
}

// ─── Horizontal layout (only layout now) ──────────────────────────────────────

function HorizontalStepper({
  status,
  isPast,
  description,
  events,
  className,
}: Omit<OrderStepperProps, "cancelled">) {
  const activeStep = getDisplayStep(status);
  const isCompleted = status === "DELIVERED";

  const currentStepEvents = events ? getEventsForStep(events, activeStep) : [];
  const currentTimestamp = currentStepEvents.length
    ? formatOrderTime(currentStepEvents[0].createdAt, isPast)
    : null;

  return (
    <div className={cn("w-full", className)}>
      {/* Current step description + timestamp — shown once, at the top */}
      {(description || currentTimestamp) && (
        <div className="mb-3 flex flex-col gap-1 px-2 py-2">
          {description && (
            <p className="leading-tight text-[16px] text-zinc-900 font-medium">
              {description.current}
            </p>
          )}
          {currentTimestamp && (
            <div className="flex items-center justify-between">
              <p className="text-[13px]  text-paragraph/80">
                {description?.past}
              </p>
              <p className="shrink-0 text-[12px] text-brand font-semibold">
                {description?.timestamp}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step row */}
      <div className="flex w-full items-start">
        {ORDER_STEPS.map(({ step, label }, index) => {
          const isDone =
            step < activeStep || (isCompleted && step === activeStep);
          const isActive = step === activeStep && !isCompleted;
          const state = isDone ? "done" : isActive ? "active" : "pending";

          return (
            <Fragment key={step}>
              {index > 0 && (
                <div className="mt-4 h-0.5 min-w-0 flex-1 self-start">
                  <div
                    className={cn(
                      "h-full w-full transition-colors duration-300",
                      step <= activeStep ? "bg-emerald-500" : "bg-zinc-200",
                    )}
                  />
                </div>
              )}

              <div className="flex w-14 flex-col items-center">
                <StepDot state={state} number={step} />
                <p
                  className={cn(
                    "mt-1.5 w-full text-center text-[11px] font-semibold leading-tight",
                    isDone || isActive ? "text-zinc-900" : "text-zinc-400",
                  )}
                >
                  {label}
                </p>
              </div>
            </Fragment>
          );
        })}
      </div>
    </div>
  );
}

export default function OrderStepper({
  status,
  isPast,
  description,
  events,
  cancelled = false,
  className,
}: OrderStepperProps) {
  if (cancelled) {
    return (
      <CancelledState events={events} isPast={isPast} className={className} />
    );
  }

  return (
    <HorizontalStepper
      status={status}
      isPast={isPast}
      description={description}
      events={events}
      className={className}
    />
  );
}
