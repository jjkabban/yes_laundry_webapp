"use client";

import { OrderDraft } from "@/types/shared/order.type";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Icon from "../icons/LucideIcons";

type Props = {
  draftOrder: OrderDraft[];
};

const TOTAL_STEPS = 4;
export default function RecentDraftOrders({ draftOrder }: Props) {
  const router = useRouter();
  return (
    <div className="mt-5 md:mt-6">
      <div>
        <h3 className="font-semibold text-xl md:text-2xl px-5 pt-1">
          Continue where you left off
        </h3>

        <div
          className="flex gap-3 py-4 md:flex-wrap overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none pl-5 pr-4
     "
        >
          {draftOrder.map((draft) => (
            <div
              onClick={() => {
                router.push(`/booking?${draft.id}`);
              }}
              key={draft.id}
              className="flex w-3/4 md:w-[300] md:grow-0  shrink-0 grow leading-4 gap-2 items-center  border-[0.5px] border-paragraph/20 py-2 px-4 rounded-xl"
            >
              <div className="relative flex items-center justify-center bg-brand/10  h-[50] w-15 overflow-hidden rounded-xl shrink-0">
                <Icon
                  name={
                    (draft.service?.icon as keyof typeof Icon) ??
                    "WashingMachine"
                  }
                />
              </div>

              <div className="shrink-0 grow">
                <h3 className="font-medium text-[14px] leading-tight">
                  Standard wash
                </h3>
                <span className="text-[12px]">
                  GHS 100 &middot; Step {draft.currentStep}/{TOTAL_STEPS}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
