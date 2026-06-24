"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";
import { CalendarCheck } from "lucide-react";

export default function SchedulePickupSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="px-6 py-20 bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left: heading */}
        <motion.div
          className="flex-1"
          initial={{ opacity: 0, x: -40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#b8964e]">
            Get started
          </span>
          <h2 className="mt-3 text-3xl md:text-5xl font-semibold text-paragraph tracking-tight leading-tight">
            Ready to wash? <br />
            <span className="text-brand">Schedule your pickup.</span>
          </h2>
          <p className="mt-4 text-sm md:text-base text-[#5a6472] leading-relaxed max-w-md">
            Pick a time that works for you. We'll handle the rest — collection,
            cleaning, and delivery back to your door.
          </p>
        </motion.div>

        {/* Right: form card */}
        <motion.div
          className="w-full lg:w-[480] bg-white rounded-2xl shadow-sm border border-paragraph/6 p-8 flex flex-col gap-5"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text/60 uppercase tracking-wider">
              Full name
            </label>
            <input
              type="text"
              placeholder="Jane Doe"
              className="w-full px-4 py-3 rounded-xl border border-paragraph/10 bg-[#f1f5f9] text-sm text-paragraph placeholder:text-paragraph/30 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-paragraph/60 uppercase tracking-wider">
              Phone number
            </label>
            <input
              type="tel"
              placeholder="+1 000 000 0000"
              className="w-full px-4 py-3 rounded-xl border border-paragraph/10 bg-[#f1f5f9] text-sm text-paragraph placeholder:text-paragraph/30 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-paragraph/60 uppercase tracking-wider">
              Pickup date
            </label>
            <input
              type="date"
              className="w-full px-4 py-3 rounded-xl border border-paragraph/10 bg-[#f1f5f9] text-sm text-paragraph focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-paragraph/60 uppercase tracking-wider">
              Address
            </label>
            <input
              type="text"
              placeholder="123 Main St, City"
              className="w-full px-4 py-3 rounded-xl border border-paragraph/10 bg-[#f1f5f9] text-sm text-paragraph placeholder:text-paragraph/30 focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>

          <button className="mt-1 w-full md:w-1/2 md:mx-auto flex items-center justify-center gap-2 bg-paragraph hover:bg-brand text-white text-sm font-semibold py-3.5 rounded-full transition-all duration-300 hover:-translate-y-0.5">
            <CalendarCheck size={16} strokeWidth={2} />
            Schedule Pickup
          </button>
        </motion.div>
      </div>
    </section>
  );
}
