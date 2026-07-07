"use client";

import { useState } from "react";
import {
  ChevronDown,
  Timer,
  Shirt,
  ShieldAlert,
  RefreshCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ServicePolicy } from "@/types/shared/service.types";
import Icon from "../icons/LucideIcons";

interface Policy {
  icon: LucideIcon;
  title: string;
  description: string;
}

const policiesData: Policy[] = [
  {
    icon: Timer,
    title: "Cancellation",
    description:
      "Cancel up to 2 hours before pickup for a full refund. After that, a 20% fee applies.",
  },
  {
    icon: Shirt,
    title: "Damaged or lost items",
    description:
      "We treat your clothes with care. If an item is damaged, we'll compensate up to 5× the service price of that item.",
  },
  {
    icon: ShieldAlert,
    title: "Special care items",
    description:
      "Delicate fabrics (silk, wool, leather) are not covered under this service. Please use our Dry Clean service instead.",
  },
  {
    icon: RefreshCcw,
    title: "Rewash guarantee",
    description:
      "Not satisfied? We'll rewash your order for free within 24 hours of delivery, no questions asked.",
  },
];

type Props = {
  policies: ServicePolicy[];
};

export default function ServicePolicyAccordion({ policies }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  const poly = policies ?? policiesData;

  return (
    <div className="flex flex-col">
      {poly.map((p, index) => {
        const isOpened = p.title === selected;

        return (
          <div
            key={p.title}
            onClick={() => setSelected(isOpened ? null : p.title)}
            className={`flex flex-col gap-3 py-4 cursor-pointer ${
              index !== policies.length - 1 ? "border-b border-paragraph/8" : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand/8 text-brand shrink-0">
                  <Icon
                    name={p.icon as keyof typeof Icon}
                    size={16}
                    strokeWidth={1.8}
                  />
                </span>
                <span className="text-[14.5px] font-semibold text-paragraph">
                  {p.title}
                </span>
              </div>
              <motion.div animate={{ rotate: isOpened ? 180 : 0 }}>
                <ChevronDown size={18} className="text-[#8a92a0]" />
              </motion.div>
            </div>

            {isOpened && (
              <p className="text-[13.5px] text-[#5a6472] leading-relaxed pl-12">
                {p.description}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}
