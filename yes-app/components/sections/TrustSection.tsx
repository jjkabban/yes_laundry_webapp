"use client";

import {
  motion,
  type Variants,
  useInView,
  useReducedMotion,
} from "motion/react";
import { useRef } from "react";
import { Zap, Sparkles, ShieldCheck, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSafeReducedMotion } from "@/hooks/useSafeReduceMotion";

interface TrustIndicator {
  icon: React.ElementType;
  title: string;
  summary: string;
}

const trustIndicators: TrustIndicator[] = [
  {
    icon: Zap,
    title: "Fast pickup",
    summary: "Schedule in seconds and we're at your door.",
  },
  {
    icon: Sparkles,
    title: "Quality cleaning",
    summary: "Expert care for every fabric we handle.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    summary: "Pay your way with any payment method.",
  },
  {
    icon: Award,
    title: "Trusted service",
    summary: "Thousands of happy customers have proven it.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function TrustSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const reduceMotion = useSafeReducedMotion();

  return (
    <section
      ref={sectionRef}
      className="relative py-16 md:py-24 px-6 overflow-hidden "
    >
      {/* ambient accents */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-brand/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-brand/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-3xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-10 md:mb-14"
        >
          <span className="text-[13px] font-bold uppercase tracking-[0.3em] text-brand">
            Our promise
          </span>
          <h3 className="mt-3 text-[26px] md:text-4xl font-bold tracking-tight font-poppins text-[#12181f]">
            Your trusted laundry partner
          </h3>
          <p className="mt-4 text-[15px] md:text-base leading-relaxed text-[#5c6570] max-w-xl mx-auto">
            At Yes Laundry, we take care of your laundry so you can focus on
            what matters most — while enjoying fresh, clean clothes every time.
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24, scale: 0.98 }}
          animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
          className="relative rounded-[1.75rem] overflow-hidden h-80 md:h-80 mb-14 md:mb-16 shadow-[0_20px_50px_-20px_rgba(18,24,31,0.25)]"
        >
          <Image
            src="/images/happy_customers.jpg"
            alt="Freshly cleaned and folded laundry"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full pl-2 pr-4 py-1.5">
            <div className="h-7 w-7 rounded-full bg-brand flex items-center justify-center shrink-0">
              <Sparkles size={13} className="text-white" />
            </div>
            <Link
              href={"/testimonials"}
              className="text-[12px] font-semibold text-[#12181f]"
            >
              Trusted by thousands of customers
            </Link>
          </div>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="relative"
        >
          <div
            aria-hidden
            className="absolute left-7 top-3 bottom-3 w-px border-l-2 border-dashed border-brand/35"
          />

          <div className="flex flex-col">
            {trustIndicators.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === trustIndicators.length - 1;

              return (
                <motion.div
                  key={item.title}
                  variants={itemVariants}
                  className={`relative flex items-start gap-5 ${
                    isLast ? "" : "pb-9"
                  }`}
                >
                  <div className="relative z-10 shrink-0 h-14 w-14 rounded-full bg-white border-2 border-brand/50 flex items-center justify-center shadow-sm">
                    <Icon size={20} className="text-brand" strokeWidth={1.8} />
                  </div>
                  <div className="pt-2.5">
                    <span className="text-[15px] font-semibold text-[#12181f] block">
                      {item.title}
                    </span>
                    <span className="text-[13px] text-[#5c6570] mt-0.5 block leading-relaxed">
                      {item.summary}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
