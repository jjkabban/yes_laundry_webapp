"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import useWindow from "@/hooks/useWindow";
import { useState } from "react";
import {
  Plus,
  CalendarCheck,
  Truck,
  Sparkles,
  PackageCheck,
  ArrowRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { steps } from "@/data/pages/how-it-works";

export default function HowItWorksSection() {
  const { isMobile, isTablet } = useWindow();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const router = useRouter();

  const isSmallScreen = isMobile || isTablet;

  return (
    <section className="relative py-30 md:py-28 px-6  overflow-hidden">
      {/* ambient premium glow */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-[420] w-[420] rounded-full bg-[radial-gradient(circle,rgba(184,150,78,0.12),transparent_70%)] blur-2xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[420] w-[420] rounded-full bg-[radial-gradient(circle,rgba(10,25,41,0.08),transparent_70%)] blur-2xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-[13px] font-bold uppercase tracking-[0.20em] text-brand">
            How it works
          </span>
          <h2 className="mt-4 text-3xl md:text-[42px] font-semibold text-paragraph tracking-tight leading-[1.1]">
            Laundry in 4 simple steps
          </h2>
          <p className="mt-4 text-[14.5px] md:text-base text-[#5a6472] leading-relaxed">
            Our laundry system is designed for ultimate ease and clarity — from
            booking to delivery, we've made every step effortless.
          </p>
        </motion.div>

        {/* Steps */}
        {isSmallScreen ? (
          <div className="flex flex-col divide-y divide-paragraph/8 rounded-3xl bg-white border border-black/4 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.15)] px-5 mb-16">
            {steps.map((step, index) => {
              const isOpen = openIndex === index;
              const StepIcon = step.icon;
              return (
                <div key={step.number}>
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="w-full flex items-center justify-between py-4 text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center justify-center h-9 w-9 rounded-full shrink-0 transition-colors duration-300 ${
                          isOpen
                            ? "bg-linear-to-br from-brand to-paragraph text-white"
                            : "bg-brand/8 text-brand"
                        }`}
                      >
                        <StepIcon size={16} strokeWidth={1.8} />
                      </span>
                      <span className="font-medium font-heading">
                        {step.title}
                      </span>
                    </div>
                    <motion.span
                      animate={{ rotate: isOpen ? 45 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-gold text-xl leading-none shrink-0 ml-4"
                    >
                      <Plus size={20} />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="pb-4 pl-12 text-[#5a6472] leading-relaxed">
                          {step.description}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12 } },
            }}
            className="relative grid grid-cols-4 gap-6 mb-16"
          >
            {/* connecting line */}
            <div className="absolute top-[27] left-[12.5%] right-[12.5%] h-[2] bg-linear-to-r from-brand/15 via-gold/60 to-brand/15" />

            {steps.map((step) => {
              const StepIcon = step.icon;
              return (
                <motion.div
                  key={step.number}
                  variants={{
                    hidden: { opacity: 0, y: 24 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                    },
                  }}
                  className="group relative flex flex-col items-center text-center px-2"
                >
                  <span className="relative z-10 flex items-center justify-center h-14 w-14 rounded-full bg-linear-to-br from-brand to-paragraph text-white shadow-[0_10px_24px_-8px_rgba(10,25,41,0.45)] ring-8 ring-[#FBFAF7] transition-transform duration-300 group-hover:scale-110">
                    <StepIcon size={20} strokeWidth={1.8} />
                  </span>
                  <span className="mt-4 text-[13px] font-semibold text-gold/70 tracking-widest">
                    {step.number}
                  </span>
                  <h3 className="mt-1 text-base font-semibold text-paragraph">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-[13px] text-[#5a6472] leading-relaxed max-w-[200]">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/*image gallery */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-4 sm:auto-rows-[140px] md:auto-rows-[160px] gap-4"
        >
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              variants={{
                hidden: { opacity: 0, scale: 0.94 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              className={`h-[230] w-full relative rounded-3xl overflow-hidden aspect-4/3 sm:aspect-auto shadow-[0_16px_40px_-20px_rgba(10,25,41,0.35)] ring-1 ring-black/4 `}
            >
              <Image
                src={step.image}
                alt={step.title}
                fill
                className="object-cover transition-transform duration-1100 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-linear-to-t from-paragraph/85 via-paragraph/10 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              <div className="absolute inset-0 flex flex-col justify-end p-5">
                <span className="text-[11px] font-bold tracking-[0.18em] text-gold">
                  {step.number}
                </span>
                <h4 className="text-white text-[15px] md:text-[17px] font-semibold tracking-tight">
                  {step.title}
                </h4>
              </div>

              <div className="absolute inset-0 ring-1 ring-inset ring-white/0 group-hover:ring-white/15 transition-all duration-500 rounded-3xl" />
            </motion.div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mt-16 md:mt-30"
        >
          <p className="text-paragraph mb-5">
            Enjoy convenience and quality every time with Yes Laundry.
          </p>
          <button
            onClick={() => {
              router.push("/signup");
            }}
            className="inline-flex items-center gap-2 bg-linear-to-r from-brand to-paragraph text-white font-semibold px-9 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_-10px_rgba(10,25,41,0.5)]"
          >
            Start booking
            <ArrowRight
              size={16}
              className="transition-transform duration-300"
            />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
