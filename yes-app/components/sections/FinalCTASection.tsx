"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Logo } from "../ui";

export default function FinalCTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section
      ref={ref}
      className="px-6 py-24 bg-paragraph overflow-hidden relative"
    >
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600] h-[600] bg-brand/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-3xl mx-auto flex flex-col items-center text-center gap-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10">
            <Sparkles size={13} className="text-brand" />
            <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand">
              <Logo height={200} width={200} type="light" />
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-tight leading-tight">
            Fresh laundry, <br />
            <span className="text-brand">zero effort.</span>
          </h2>

          <p className="text-sm md:text-base text-white/50 leading-relaxed max-w-md">
            Join thousands of customers who've handed off laundry day for good.
            Create your account and book your first pickup in under a minute.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-2 w-3/5"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.15 }}
        >
          <button className="flex md:w-1/2 sm:w-2/3 items-center justify-center gap-2 bg-brand hover:bg-[#003a73] text-white font-semibold text-sm px-8 py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5">
            Create account
            <ArrowRight size={15} strokeWidth={2.5} />
          </button>
          <button className="text-white/60 md:w-1/2 sm:w-2/3 hover:text-white text-sm font-medium px-6 py-3.5 rounded-full border border-white/10 hover:border-white/25 transition-all duration-300">
            Book as guest
          </button>
        </motion.div>

        <motion.p
          className="text-[11px] text-white/30 mt-1"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          No subscription required · Cancel anytime
        </motion.p>
      </div>
    </section>
  );
}
