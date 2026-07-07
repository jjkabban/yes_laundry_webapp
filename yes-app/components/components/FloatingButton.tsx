"use client";

import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { ServicePriceModel } from "@/types/shared/service.types";

type Props = {
  price: number;
  title: string;
  turnaroundTime: string;
  priceModel: ServicePriceModel;
  serviceId?: string;
};

export const FloatingButton = ({
  price,
  title,
  turnaroundTime,
  priceModel,
  serviceId,
}: Props) => {
  const router = useRouter();

  const priceLabel = priceModel === "PER_ITEM" ? "per item" : "per bag";

  return (
    <div className="fixed z-50 bottom-0 left-0 right-0 bg-white border-t border-paragraph/10 rounded-t-2xl shadow-[0_-8px_24px_-8px_rgba(10,25,41,0.12)] px-5 pt-4 pb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <span className="font-semibold text-[14.5px] text-paragraph block truncate">
            {title}
          </span>
          <span className="text-[14px] text-[#8a92a0]">
            GH₵{price} {priceLabel} · {turnaroundTime}
          </span>
        </div>

        <button
          onClick={() =>
            router.push(`/booking?type=${priceModel}&sid=${serviceId ?? ""}`)
          }
          className="flex w-1/2  items-center gap-1.5 shrink-0 px-6 py-4 text-white font-semibold text-[14px] rounded-full bg-gradient-to-r from-brand to-[#0a1929] transition-all duration-300 hover:gap-2.5 active:scale-[0.98]"
        >
          Add items
          <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );
};
