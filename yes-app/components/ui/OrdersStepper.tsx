"use client";

import { Fragment, useState } from "react";
import { Check, Loader2, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import {
  LiveOrderEvent,
  OrderEventType,
  OrderStatus,
} from "@/context/types/order";
import { formatOrderTime } from "@/utils/datetime";
import Icon from "../icons/LucideIcons";

type DisplayStep = 1 | 2 | 3 | 4;

const ORDER_STEPS: { step: DisplayStep; label: string; icon: string }[] = [
  { step: 1, label: "Picked up", icon: "Truck" },
  { step: 2, label: "Washing", icon: "WashingMachine" },
  { step: 3, label: "Ready", icon: "Shirt" },
  { step: 4, label: "Delivered", icon: "Home" },
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

const EVENT_LABELS: Partial<Record<OrderEventType, string>> = {
  CREATED: "Order placed",
  CONFIRMED: "Order confirmed",
  ASSIGNED: "Staff assigned",
  REASSIGNED: "Staff reassigned",
  PICKED_UP: "Rider picked up",
  PROCESSING_STARTED: "Processing started",
  PROFESSIONAL_CLEANING: "Deep cleaning",
  READY: "Packed and labelled",
  OUT_FOR_DELIVERY: "Out for delivery",
  DELIVERED: "Delivered to customer",
  PAYMENT_RECEIVED: "Payment received",
  NOTE_ADDED: "Note added",
};

export function getDisplayStep(status: OrderStatus): DisplayStep {
  switch (status) {
    case "PICKED_UP":
      return 1;
    case "IN_PROGRESS":
      return 2;
    case "READY":
      return 4;
    case "OUT_FOR_DELIVERY":
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
        "flex h-10 w-10 relative shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300",
        state === "done" && "bg-emerald-600 text-white",
        (state === "pending" || state === "active") &&
          "border border-zinc-200 bg-zinc-100 text-black/70",
      )}
    >
      <div className="flex items-center justify-center w-full h-full">
        <Icon
          name={iconName as keyof typeof Icon}
          size={20}
          strokeWidth={2.4}
        />
      </div>

      {state === "active" && (
        <div className="absolute inset-0 rounded-full border-2 border-brand border-t-transparent animate-spin" />
      )}
    </div>
  );
}

function SubStepList({
  events,
  isPast,
}: {
  events: LiveOrderEvent[];
  isPast: boolean;
}) {
  return (
    <div className="mt-2 flex flex-col gap-2 border-l-2 border-zinc-100 pl-3 dark:border-zinc-800">
      {events.map((event) => (
        <div key={event.id} className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">
            {EVENT_LABELS[event.eventType] ?? event.eventType}
          </span>
          <span className="text-[11px] text-zinc-400 dark:text-zinc-500">
            {formatOrderTime(event.createdAt, isPast)}
          </span>
          {event.notes && (
            <span className="text-[11px] italic text-zinc-400 dark:text-zinc-500">
              {event.notes}
            </span>
          )}
        </div>
      ))}
    </div>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

export interface OrderStepperProps {
  status: OrderStatus;
  orientation: "vertical" | "horizontal";
  isPast: boolean;
  description?: string;
  events?: LiveOrderEvent[];
  cancelled?: boolean;
  className?: string;
}

// ─── Vertical layout ──────────────────────────────────────────────────────────

function VerticalStepper({
  status,
  isPast,
  description,
  events,
  className,
}: Omit<OrderStepperProps, "orientation" | "cancelled">) {
  const activeStep = getDisplayStep(status);
  const [openSteps, setOpenSteps] = useState<Set<DisplayStep>>(new Set());

  function toggleStep(step: DisplayStep) {
    setOpenSteps((prev) => {
      const next = new Set(prev);
      next.has(step) ? next.delete(step) : next.add(step);
      return next;
    });
  }

  return (
    <div className={cn("flex flex-col", className)}>
      {ORDER_STEPS.map(({ step, label }, index) => {
        const isCompleted = status === "DELIVERED";
        const isDone =
          step < activeStep || (isCompleted && step === activeStep);
        const isActive = step === activeStep && !isCompleted;
        const state = isDone ? "done" : isActive ? "active" : "pending";
        const isLast = index === ORDER_STEPS.length - 1;
        const stepEvents = events ? getEventsForStep(events, step) : [];
        const hasEvents = stepEvents.length > 0;
        const isOpen = openSteps.has(step);
        const timestamp = hasEvents
          ? formatOrderTime(stepEvents[0].createdAt, isPast)
          : null;

        return (
          <div key={step} className="flex gap-3">
            {/* Dot + vertical connector */}
            <div className="flex flex-col items-center">
              <StepDot state={state} number={step} />
              {!isLast && (
                <div className="my-1 w-0.5 flex-1 self-stretch">
                  <div
                    className={cn(
                      "h-full w-full transition-colors duration-300",
                      isDone
                        ? "bg-emerald-500"
                        : "bg-zinc-200 dark:bg-zinc-700",
                    )}
                  />
                </div>
              )}
            </div>

            {/* Content */}
            <div className={cn("flex-1 pt-1", !isLast && "pb-6")}>
              <p
                className={cn(
                  "text-[13px] font-medium leading-none",
                  isDone || isActive
                    ? "text-zinc-900 dark:text-zinc-100"
                    : "text-zinc-400 dark:text-zinc-500",
                )}
              >
                {label}
              </p>

              {isActive && description && (
                <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                  {description}
                </p>
              )}

              {timestamp && (
                <p className="mt-1 text-xs text-zinc-400 dark:text-zinc-500">
                  {timestamp}
                </p>
              )}

              {hasEvents && (
                <button
                  onClick={() => toggleStep(step)}
                  className={cn(
                    "mt-2 flex items-center gap-1 text-[11px] font-medium transition-colors",
                    isDone || isActive
                      ? "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                      : "text-zinc-300 dark:text-zinc-600",
                  )}
                >
                  <ChevronDown
                    className={cn(
                      "h-3 w-3 transition-transform duration-200",
                      isOpen && "rotate-180",
                    )}
                  />
                  {isOpen
                    ? "Hide details"
                    : `Show details (${stepEvents.length})`}
                </button>
              )}

              {isOpen && hasEvents && (
                <SubStepList events={stepEvents} isPast={isPast} />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function HorizontalStepper({
  status,
  isPast,
  description,
  events,
  className,
}: Omit<OrderStepperProps, "orientation" | "cancelled">) {
  const activeStep = getDisplayStep(status);
  const [openStep, setOpenStep] = useState<DisplayStep | null>(null);

  function toggleStep(step: DisplayStep) {
    setOpenStep((prev) => (prev === step ? null : step));
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Step row */}
      <div className="flex w-full items-start">
        {ORDER_STEPS.map(({ step, label }, index) => {
          const isCompleted = status === "DELIVERED";
          const isDone =
            step < activeStep || (isCompleted && step === activeStep);
          const isActive = step === activeStep && !isCompleted;
          const state = isDone ? "done" : isActive ? "active" : "pending";

          const stepEvents = events ? getEventsForStep(events, step) : [];
          const hasEvents = stepEvents.length > 0;
          const timestamp = hasEvents
            ? formatOrderTime(stepEvents[0].createdAt, isPast)
            : null;

          return (
            <Fragment key={step}>
              {/* Connecting line — lives between steps, not inside them */}
              {index > 0 && (
                <div className="mt-5 h-0.5 min-w-0 flex-1 self-start">
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

                <div className="mt-1.5 flex w-full flex-col items-center text-center">
                  <p
                    className={cn(
                      "w-full text-[11px] font-semibold leading-tight",
                      isDone || isActive ? "text-zinc-900" : "text-zinc-400",
                    )}
                  >
                    {label}
                  </p>

                  {isActive && description && (
                    <p className="mt-0.5 text-[10px] leading-tight text-zinc-500 dark:text-zinc-400">
                      {description}
                    </p>
                  )}

                  {timestamp && (
                    <p className="mt-0.5 text-[10px] text-zinc-400 dark:text-zinc-500">
                      {timestamp}
                    </p>
                  )}

                  {hasEvents && (
                    <button
                      onClick={() => toggleStep(step)}
                      className={cn(
                        "mt-1.5 flex items-center gap-0.5 text-[10px] font-medium transition-colors",
                        isDone || isActive
                          ? "text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
                          : "text-zinc-300 dark:text-zinc-600",
                      )}
                    >
                      <ChevronDown
                        className={cn(
                          "h-2.5 w-2.5 transition-transform duration-200",
                          openStep === step && "rotate-180",
                        )}
                      />
                      {openStep === step ? "Hide" : stepEvents.length}
                    </button>
                  )}
                </div>
              </div>
            </Fragment>
          );
        })}
      </div>

      {/* Expanded sub-details panel — shown below the full row */}
      {openStep !== null &&
        (() => {
          const stepEvents = events ? getEventsForStep(events, openStep) : [];
          return stepEvents.length > 0 ? (
            <div className="mt-4 rounded-lg border border-zinc-100 bg-zinc-50 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900">
              <p className="mb-2 text-xs font-medium text-zinc-500 dark:text-zinc-400">
                {ORDER_STEPS.find((s) => s.step === openStep)?.label} — details
              </p>
              <SubStepList events={stepEvents} isPast={isPast} />
            </div>
          ) : null;
        })()}
    </div>
  );
}

// ─── Root component ───────────────────────────────────────────────────────────

export default function OrderStepper({
  status,
  orientation,
  isPast,
  description,
  events,
  cancelled = false,
  className,
}: OrderStepperProps) {
  if (cancelled) {
    return (
      <div className={cn("", className)}>
        <p className="text-sm">Contact support for more info</p>
      </div>
    );
  }

  if (orientation === "horizontal") {
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

  return (
    <VerticalStepper
      status={status}
      isPast={isPast}
      description={description}
      events={events}
      className={className}
    />
  );
}
