"use client";
import { motion, useInView } from "motion/react";
import { Suspense, useCallback, useRef, useState } from "react";
import { CalendarCheck } from "lucide-react";
import { BottomSheet } from "../components";
import BookingForm from "../form/BookingForm";

type FormType = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pickupDate: string;
  pickupAddress: string;
  deliveryAddress: string;
};

export default function SchedulePickupSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });
  const [form, setForm] = useState<FormType>();
  const [openSheet, setOpenSheet] = useState(false);

  const onFormSubmit = () => {};

  return (
    <section ref={ref} className=" px-3 py-20 bg-[#f1f5f9]">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-10">
        {/* Left: heading */}
        <motion.div
          className="flex-1 px-3"
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
          className="w-full md:max-w-3xl md:mx-auto lg:w-[480] bg-white rounded-2xl shadow-sm border border-paragraph/6  flex flex-col gap-5"
          initial={{ opacity: 0, x: 40 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        >
          <Suspense fallback={null}>
            <BookingForm />
          </Suspense>
        </motion.div>
      </div>
    </section>
  );
}
