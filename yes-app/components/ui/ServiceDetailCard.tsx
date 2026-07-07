"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Service } from "@/types/shared/service.types";
import { getServiceStep } from "@/data/pages/service-detials";
import Icon from "../icons/LucideIcons";
import { getServiceStats } from "@/data/pages/service.general";

export default function ServiceDetailCard({
  service,
  index,
}: {
  service: Service;
  index: number;
}) {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const router = useRouter();
  const steps = getServiceStep(service.slug);

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.6,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative rounded-[1.75rem] overflow-hidden bg-white shadow-[0_10px_30px_-12px_rgba(10,25,41,0.18)] border border-black/4"
    >
      {/* Image header */}
      <div className="relative h-[220] overflow-hidden">
        <Image
          src={service.coverImage?.url ?? getServiceStats(service.slug).image}
          alt={service.title}
          fill
          className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/90 via-[#0a1929]/25 to-transparent" />

        <div className="absolute top-4 left-4 h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
          <Icon
            name={service.icon as keyof typeof Icon}
            size={18}
            className="text-brand"
            strokeWidth={1.8}
          />
        </div>

        <div className="absolute top-4 right-4 rounded-full bg-gradient-to-r from-gold to-[#a4813f] px-3 py-1 text-[13px] font-semibold text-white shadow-sm">
          From GH₵{service.basePrice}
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h3 className="text-[20px] font-semibold text-white tracking-tight leading-tight">
            {service.title}
          </h3>
          <p className="text-[12.5px] text-white/80 mt-0.5">
            {service.contextDescription}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 pt-5 pb-6">
        <p className="text-[13.5px] text-[#5a6472] leading-relaxed">
          {service.description}
        </p>

        <div className="flex items-center justify-between mt-5 mb-3">
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand/70">
            How it works
          </span>
          <span className="text-[11px] text-[#8a92a0]">
            {service.turnaroundTime}
          </span>
        </div>

        {/* Step icons */}
        <div className="relative flex items-center justify-between px-1">
          <div className="absolute left-6 right-6 top-[19px] h-[2px] bg-gradient-to-r from-brand/15 via-gold/50 to-brand/15" />
          {steps.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = activeStep === i;
            return (
              <button
                key={step.label}
                type="button"
                onClick={() => setActiveStep(isActive ? null : i)}
                className="relative z-10 flex flex-col items-center gap-1.5"
              >
                <span
                  className={`flex items-center justify-center h-10 w-10 rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-br from-brand to-[#0a1929] border-brand text-white scale-110 shadow-[0_6px_16px_-4px_rgba(10,25,41,0.5)]"
                      : "bg-white border-[#e4e2dc] text-brand/60 hover:border-gold hover:text-gold"
                  }`}
                >
                  <StepIcon size={16} strokeWidth={1.8} />
                </span>
                <span
                  className={`text-[10.5px] font-medium transition-colors ${
                    isActive ? "text-brand" : "text-[#8a92a0]"
                  }`}
                >
                  {step.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Revealed step detail */}
        <AnimatePresence mode="wait">
          {activeStep !== null && (
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: 14 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="rounded-2xl bg-gradient-to-br from-[#FBFAF7] to-[#f3f0e8] border border-black/[0.04] p-4">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="flex items-center justify-center h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-gold to-[#a4813f] text-white text-[10px] font-bold">
                    {activeStep + 1}
                  </span>
                  <h4 className="text-[13.5px] font-semibold text-paragraph">
                    {steps[activeStep].title}
                  </h4>
                </div>
                <p className="text-[12.5px] text-[#5a6472] leading-relaxed">
                  {steps[activeStep].description}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Book button */}
        <Link
          href={`/signin`}
          className="mt-5 flex items-center justify-center gap-2 bg-gradient-to-r from-brand to-[#0a1929] text-white font-semibold text-[13.5px] px-5 py-3 rounded-full transition-all duration-300 hover:gap-3 hover:shadow-[0_8px_20px_-6px_rgba(10,25,41,0.5)] hover:-translate-y-0.5"
        >
          Book service
          <ArrowRight size={14} className="transition-transform duration-300" />
        </Link>

        <Link
          href={`/services/${service.slug}`}
          className="w-full pt-4 self-center flex justify-center text-brand font-bold"
        >
          More details
        </Link>
      </div>
    </motion.div>
  );
}
