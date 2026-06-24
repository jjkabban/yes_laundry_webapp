"use client";

import { OrderDraft } from "@/context/types/order";
import Image from "next/image";

type Props = {
  draftOrder: OrderDraft[];
};

const TOTAL_STEPS = 4;
export default function RecentDraftOrders({ draftOrder }: Props) {
  return (
    <div className="mt-3 md:mt-6">
      <div>
        <h3 className="font-semibold text-md px-5 md:text-xl">
          Continue where you left off
        </h3>

        <div
          className="flex gap-3 py-4 md:flex-wrap overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory
    [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none pl-5
     "
        >
          {draftOrder.map((draft) => (
            <div
              key={draft.id}
              className="flex w-3/4 md:w-[300] md:grow-0  shrink-0 grow leading-4 gap-2 items-center  border-[0.5px] border-paragraph/20 py-2 px-4 rounded-xl"
            >
              <div className="relative h-15 w-15 overflow-hidden rounded-sm shrink-0">
                <Image
                  src={"/images/order_img.jpg"}
                  fill
                  alt="order_image"
                  className="object-fill"
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
