"use client";

import { useRef, useEffect, useState } from "react";

import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  ShoppingCart,
  Infinity,
} from "lucide-react";
import { Promotion } from "@/context/types/promotions";
import { Updock } from "next/font/google";
import { FixedPromoCard, UpgradePromoCard, PercentagePromoCard } from "../ui";

type PromoCategory = "discount" | "fixed" | "upgrade";

function getCategory(promo: Promotion): PromoCategory {
  if (promo.discountType === "PERCENTAGE") return "discount";
  if (promo.id === "promo_free_pickup") return "upgrade";
  return "fixed";
}

function formatValue(promo: Promotion) {
  return promo.discountType === "PERCENTAGE"
    ? `${promo.discountValue}% off`
    : `GH₵${promo.discountValue} off`;
}

function formatExpiry(promo: Promotion) {
  if (!promo.expiresAt) return "No expiry";
  return `Ends ${new Date(promo.expiresAt).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`;
}

const BADGE: Record<PromoCategory, { label: string; className: string }> = {
  discount: { label: "Discount", className: "bg-green-50 text-green-800" },
  fixed: { label: "Fixed value", className: "bg-blue-50 text-blue-800" },
  upgrade: {
    label: "Premium upgrade",
    className: "bg-purple-50 text-purple-800",
  },
};

type Props = {
  promotions: Promotion[];
};

export default function PromotionsList({ promotions }: Props) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateChevrons = () => {
    const el = trackRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
  };

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateChevrons, { passive: true });
    updateChevrons();
    return () => el.removeEventListener("scroll", updateChevrons);
  }, []);

  const scroll = (dir: "prev" | "next") => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLDivElement>(".promo-card");
    const amount = card ? card.offsetWidth + 12 : 280;
    el.scrollBy({
      left: dir === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-6">
      <div className="flex items-center justify-between px-5 mb-4">
        <h3 className="font-semibold text-xl md:text-xl">Offers for you</h3>

        <span className="text-sm text-brand cursor-pointer md:hidden">
          See more
        </span>

        <div className="hidden md:flex gap-1.5">
          <button
            onClick={() => scroll("prev")}
            disabled={!canPrev}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll("next")}
            disabled={!canNext}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:bg-muted disabled:opacity-30 transition-colors"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={trackRef}
        className="flex gap-3 overflow-x-auto px-5 pb-3 scrollbar-hide  scroll-smooth snap-x snap-mandatory
          [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none"
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        {promotions.map((promo) => {
          const category = getCategory(promo);
          const badge = BADGE[category];

          return (
            <div
              key={promo.id}
              className="promo-card flex-none w-[95%] max-w-[320] md:w-[280] snap-center rounded-xl  bg-card flex flex-col gap-2.5"
            >
              {category === "discount" ? (
                <PercentagePromoCard
                  title={promo.campaignName}
                  description={promo.description as string}
                  value={promo.discountValue}
                  image="/images/s1.jpg"
                />
              ) : category === "fixed" ? (
                <FixedPromoCard
                  title={promo.campaignName}
                  description={promo.description as string}
                  amount={promo.discountValue}
                  image="/images/s2.jpg"
                />
              ) : category === "upgrade" ? (
                <UpgradePromoCard
                  title={promo.campaignName}
                  description={promo.description as string}
                  image="/images/s3.jpg"
                />
              ) : null}
            </div>
          );
        })}
      </div>
    </section>
  );
}
