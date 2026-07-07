"use client";

import { MapPin, Package, Play, StopCircle, Truck } from "lucide-react";

type Props = {
  visible: boolean;
  isPaused: boolean;
  onItems: () => void;
  onPickup: () => void;
  onDelivery: () => void;
  onStop: () => void;
};

export default function RecurringOrderActions({
  visible,
  isPaused,
  onItems,
  onPickup,
  onDelivery,
  onStop,
}: Props) {
  return (
    <div
      className={`grid transition-[grid-template-rows] duration-200 ease-out
        ${visible ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}
    >
      <div className="overflow-hidden">
        <div className="border-t border-paragraph/8 px-2 py-2 grid grid-cols-4 gap-1">
          <button
            onClick={onItems}
            className="flex flex-col items-center gap-1 py-2 rounded-xl active:bg-paragraph/5"
          >
            <div className="w-9 h-9 rounded-full bg-paragraph/6 flex items-center justify-center">
              <Package size={15} className="text-paragraph/70" />
            </div>
            <span className="text-[10px] text-paragraph/60 font-medium">
              Items
            </span>
          </button>

          <button
            onClick={onPickup}
            className="flex flex-col items-center gap-1 py-2 rounded-xl active:bg-paragraph/5"
          >
            <div className="w-9 h-9 rounded-full bg-paragraph/6 flex items-center justify-center">
              <MapPin size={15} className="text-paragraph/70" />
            </div>
            <span className="text-[10px] text-paragraph/60 font-medium">
              Pickup
            </span>
          </button>

          <button
            onClick={onDelivery}
            className="flex flex-col items-center gap-1 py-2 rounded-xl active:bg-paragraph/5"
          >
            <div className="w-9 h-9 rounded-full bg-paragraph/6 flex items-center justify-center">
              <Truck size={15} className="text-paragraph/70" />
            </div>
            <span className="text-[10px] text-paragraph/60 font-medium">
              Delivery
            </span>
          </button>

          <button
            onClick={onStop}
            className="flex flex-col items-center gap-1 py-2 rounded-xl active:bg-paragraph/5"
          >
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center
                ${isPaused ? "bg-green-50" : "bg-red-50"}`}
            >
              {isPaused ? (
                <Play size={14} className="text-green-600" />
              ) : (
                <StopCircle size={15} className="text-red-500" />
              )}
            </div>
            <span
              className={`text-[10px] font-medium ${isPaused ? "text-green-600" : "text-red-500"}`}
            >
              {isPaused ? "Resume" : "Stop"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
