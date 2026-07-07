"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  User,
  Phone,
  CalendarDays,
  Clock,
  MapPin,
  Navigation,
  CheckCircle2,
  Loader2,
  ArrowRight,
  CalendarCheck,
} from "lucide-react";
import { useBookingData } from "@/context/BookingDataContext";

const timeWindows = [
  "8:00 AM – 10:00 AM",
  "10:00 AM – 12:00 PM",
  "12:00 PM – 2:00 PM",
  "2:00 PM – 4:00 PM",
];

const serviceLabels: Record<string, string> = {
  "stain-treatment": "Stain Treatment",
  "pressing-ironing": "Pressing & Ironing",
  "dry-cleaning": "Dry Cleaning",
  "personal-laundry": "Personal Laundry",
  "family-laundry": "Family Laundry",
  "commercial-laundry": "Commercial Laundry",
};

interface FormState {
  fullName: string;
  phone: string;
  pickupDate: string;
  pickupWindow: string;
  pickupAddress: string;
  deliveryAddress: string;
  sameAsPickup: boolean;
  notes: string;
}

const initialForm: FormState = {
  fullName: "",
  phone: "",
  pickupDate: "",
  pickupWindow: timeWindows[0],
  pickupAddress: "",
  deliveryAddress: "",
  sameAsPickup: true,
  notes: "",
};

function Field({
  label,
  icon: Icon,
  children,
}: {
  label: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[12.5px] font-medium text-[#5a6472]">
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a92a0] pointer-events-none"
        />
        {children}
      </div>
    </div>
  );
}

const inputClasses =
  "rounded-lg border border-paragraph/10 bg-[#FBFAF7] pl-10 pr-3.5 py-2.5 text-[13.5px] text-paragraph placeholder:text-[#8a92a0] outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/10 w-full";

export default function BookingForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const isSchedule = pathName.startsWith("/schedule");
  const preselectedService = searchParams.get("service");

  const serviceLabel = preselectedService
    ? (serviceLabels[preselectedService] ?? preselectedService)
    : null;
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!isSchedule) return;
    formRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [pathName]);

  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const { saveFormData, isLoading } = useBookingData();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        sameAsPickup: checked,
        deliveryAddress: checked ? prev.pickupAddress : prev.deliveryAddress,
      }));
      return;
    }
    setForm((prev) => {
      const next = { ...prev, [name]: value };
      if (name === "pickupAddress" && prev.sameAsPickup) {
        next.deliveryAddress = value;
      }
      return next;
    });
  };

  const simulateApiCall = <T,>(data: T, delayMs = 900): Promise<T> =>
    new Promise((resolve) => setTimeout(() => resolve(data), delayMs));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      if (typeof window !== "undefined") {
        const {
          pickupAddress,
          phone,
          pickupDate,
          pickupWindow,
          sameAsPickup,
          deliveryAddress,
          fullName,
          notes,
        } = form;

        const firstName = fullName.split(" ")[0];
        const lastName = fullName.split(" ")[1];
        const pickupTime = pickupWindow;
        const phoneNumber = phone;

        saveFormData({
          pickupAddress,
          phoneNumber,
          deliveryAddress,
          firstName,
          lastName,
          pickupTime,
          pickupDate,
          notes,
        });
      }

      //simulate api call here do that calling later
      await simulateApiCall({ ok: true });

      router.push("/signup");
    } catch (err) {
    } finally {
      setStatus("idle");
    }
  };

  return (
    <motion.form
      ref={formRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onSubmit={handleSubmit}
      className="w-full  rounded-2xl bg-white border border-black/4 md:border-black/30 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.18)] p-5 md:p-7 flex flex-col gap-5"
    >
      {serviceLabel && (
        <div className="flex items-center gap-2 rounded-lg bg-linear-to-r from-brand/8 to-gold/8 border border-gold/20 px-3.5 py-2.5">
          <span className="text-[11.5px] text-[#5a6472]">Booking for</span>
          <span className="text-[12.5px] font-semibold text-brand">
            {serviceLabel}
          </span>
        </div>
      )}

      {/* Contact details */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Full name" icon={User}>
          <input
            required
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Ama Owusu"
            className={inputClasses}
          />
        </Field>
        <Field label="Phone number" icon={Phone}>
          <input
            required
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="024 000 0000"
            className={inputClasses}
          />
        </Field>
      </div>

      {/* Pickup window */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Pickup date" icon={CalendarDays}>
          <input
            required
            type="date"
            name="pickupDate"
            value={form.pickupDate}
            onChange={handleChange}
            min={new Date().toISOString().split("T")[0]}
            className={inputClasses}
          />
        </Field>
        <Field label="Preferred time" icon={Clock}>
          <select
            name="pickupWindow"
            value={form.pickupWindow}
            onChange={handleChange}
            className={`${inputClasses} appearance-none`}
          >
            {timeWindows.map((window) => (
              <option key={window} value={window}>
                {window}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {/* Addresses */}
      <div className="flex flex-col gap-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Pickup address" icon={MapPin}>
            <input
              required
              name="pickupAddress"
              value={form.pickupAddress}
              onChange={handleChange}
              placeholder="House no., street, landmark"
              className={inputClasses}
            />
          </Field>

          <AnimatePresence initial={false} mode="wait">
            {!form.sameAsPickup ? (
              <motion.div
                key="delivery"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Field label="Delivery address" icon={Navigation}>
                  <input
                    required={!form.sameAsPickup}
                    name="deliveryAddress"
                    value={form.deliveryAddress}
                    onChange={handleChange}
                    placeholder="House no., street, landmark"
                    className={inputClasses}
                  />
                </Field>
              </motion.div>
            ) : (
              <div key="spacer" />
            )}
          </AnimatePresence>
        </div>

        <label className="flex items-center gap-2 cursor-pointer w-fit">
          <input
            type="checkbox"
            name="sameAsPickup"
            checked={form.sameAsPickup}
            onChange={handleChange}
            className="h-3.5 w-3.5 rounded border-paragraph/20 accent-[#b8964e]"
          />
          <span className="text-[12px] text-[#5a6472]">
            Deliver to the same address
          </span>
        </label>
      </div>

      {/* Notes */}
      <Field label="Notes (optional)" icon={CheckCircle2}>
        <textarea
          rows={2}
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Anything else we should know?"
          className={`${inputClasses} resize-none pt-2.5`}
        />
      </Field>

      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-2 bg-linear-to-r from-brand to-paragraph text-white font-semibold text-[13.5px] px-6 py-3 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(10,25,41,0.5)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:gap-2"
      >
        {status === "loading" ? (
          <>
            <Loader2 size={15} className="animate-spin" />
            Scheduling...
          </>
        ) : (
          <>
            Schedule pickup
            <CalendarCheck size={14} />
          </>
        )}
      </button>
    </motion.form>
  );
}
