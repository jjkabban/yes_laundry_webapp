"use client";

import { motion, AnimatePresence } from "motion/react";
import { useState, type FormEvent } from "react";
import {
  Phone,
  Mail,
  MapPin,
  MessageCircle,
  Clock,
  Send,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { api } from "@/lib/api/client";
import { useClientError } from "@/context/ErrorContext";
import { usePathname } from "next/navigation";
import { locations, contactInfo, hours, subjects } from "@/data/pages/contact";

interface FormState {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const initialForm: FormState = {
  name: "",
  email: "",
  phone: "",
  subject: subjects[0],
  message: "",
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const { setClientError } = useClientError();
  const pathName = usePathname();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      setStatus("loading");

      await api.post("/contact", { ...form });

      setStatus("sent");
      setForm(initialForm);
    } catch (err: any) {
      setClientError([
        {
          pathName,
          page: "contact-page",
          message: err?.message,
          type: err?.type,
        },
      ]);
    } finally {
      setStatus("sent");
    }
  };

  return (
    <main className="bg-[#FBFAF7] min-h-screen py-5">
      {/* Hero */}
      <section className="relative overflow-hidden bg-linear-to-br from-paragraph via-brand to-paragraph">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,150,78,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(184,150,78,0.14),transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-3 py-20 md:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[13px] font-bold uppercase tracking-[0.22em] text-gold"
          >
            Get in touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            We'd love to hear from you
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[15px] text-white/70 leading-relaxed max-w-xl mx-auto"
          >
            Questions about an order, a partnership idea, or just feedback —
            reach us however's easiest for you.
          </motion.p>
        </div>

        <div className="h-px w-full bg-linear-to-r from-transparent via-gold/40 to-transparent" />
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-6 md:mx-auto md:max-w-3xl">
        <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr] gap-10">
          {/* Left: info */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-4"
          >
            {contactInfo.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-2xl bg-white border border-black/4 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.18)] p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_14px_34px_-14px_rgba(10,25,41,0.25)]"
                >
                  <span className="flex items-center justify-center h-12 w-12 shrink-0 rounded-full bg-linear-to-br from-brand to-paragraph text-white transition-transform duration-300 group-hover:scale-105">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[13px] font-bold uppercase  text-brand">
                      {item.label}
                    </p>
                    <p className="text-[14.5px] font-medium text-paragraph mt-0.5">
                      {item.value}
                    </p>
                  </div>
                </a>
              );
            })}

            {/* Locations */}
            <div className="rounded-2xl bg-linear-to-br from-paragraph to-brand p-5 text-white mt-1">
              <div className="flex items-center gap-2 mb-3">
                <MapPin size={16} className="text-gold" />
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-gold">
                  Where we operate
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {locations.map((loc) => (
                  <div key={loc.city} className="py-2">
                    <p className="text-[14.5px] font-semibold">{loc.city}</p>
                    <p className="text-[12.5px] text-white/80">{loc.area}</p>
                    <p className="text-[12.5px] text-white/80">
                      GPS Address: {loc.gps}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/*map */}
            <div className="w-full overflow-hidden py-5  rounded-3xl my-8 border border-paragraph/40 shadow-2xl ">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.925580377238!2d-0.16761479223378078!3d5.578019994379236!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xfdf9b1027d3cc8b%3A0x2fdc1a82da8a7513!2sYes%20Laundry!5e0!3m2!1sen!2sgh!4v1782925505844!5m2!1sen!2sgh"
                height="300"
                width={"600"}
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              ></iframe>
            </div>

            {/* Hours */}
            <div className="rounded-2xl bg-white border border-black/4 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.18)] p-5">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-brand font-bold" />
                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-brand">
                  Support hours
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {hours.map((h) => (
                  <div
                    key={h.day}
                    className="flex items-center justify-between text-[13px]"
                  >
                    <span className="text-[#5a6472]">{h.day}</span>
                    <span className="font-medium text-paragraph">{h.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-[1.75rem] bg-white border border-black/4 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.18)] p-6 md:p-8"
          >
            <AnimatePresence mode="wait">
              {status === "sent" ? (
                <motion.div
                  key="sent"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  className="flex flex-col items-center justify-center text-center py-16"
                >
                  <span className="flex items-center justify-center h-16 w-16 rounded-full bg-linear-to-br from-gold to-[#a4813f] text-white mb-5">
                    <CheckCircle2 size={28} />
                  </span>
                  <h3 className="text-xl font-semibold text-paragraph">
                    Message sent
                  </h3>
                  <p className="mt-2 text-[13.5px] text-[#5a6472] max-w-xs">
                    Thanks for reaching out — our team will get back to you
                    shortly.
                  </p>
                  <button
                    type="button"
                    onClick={() => setStatus("idle")}
                    className="mt-6 text-[13px] font-semibold text-brand underline underline-offset-4 decoration-gold/50 hover:decoration-gold"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px]  font-medium text-paragraph">
                        Full name
                      </label>
                      <input
                        required
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Ama Owusu"
                        className="rounded-xl border border-paragraph/10 bg-[#FBFAF7] px-4 py-3 text-[13.5px] text-paragraph placeholder:text-[#8a92a0] outline-none transition-colors focus:border-brand focus:bg-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[14px]  font-medium text-paragraph">
                        Phone number
                      </label>
                      <input
                        required
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="024 000 0000"
                        className="rounded-xl border border-paragraph/10 bg-[#FBFAF7] px-4 py-3 text-[13.5px] text-paragraph placeholder:text-[#8a92a0] outline-none transition-colors focus:border-brand focus:bg-white"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px]  font-medium text-paragraph">
                      Email address
                    </label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="rounded-xl border border-paragraph/10 bg-[#FBFAF7] px-4 py-3 text-[13.5px] text-paragraph placeholder:text-[#8a92a0] outline-none transition-colors focus:border-brand focus:bg-white"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px]  font-medium text-paragraph">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      className="rounded-xl border border-paragraph/10 bg-[#FBFAF7] px-4 py-3 text-[13.5px] text-paragraph outline-none transition-colors focus:border-brand focus:bg-white"
                    >
                      {subjects.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[14px] font-medium text-paragraph">
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="How can we help?"
                      className="resize-none rounded-xl border border-paragraph/10 bg-[#FBFAF7] px-4 py-3 text-[13.5px] text-paragraph placeholder:text-[#8a92a0] outline-none transition-colors focus:border-brand focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="mt-1 flex items-center justify-center gap-2 bg-linear-to-r from-brand to-paragraph text-white font-semibold text-[14px] px-6 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(10,25,41,0.5)] disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:gap-2"
                  >
                    {status === "loading" ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Send message
                        <Send size={15} />
                      </>
                    )}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
