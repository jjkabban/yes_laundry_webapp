"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, type Variants } from "motion/react";
import { CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import {
  values,
  differentiators,
  locations,
  team,
  stats,
} from "@/data/pages/about";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function AboutPage() {
  return (
    <main className="bg-[#FBFAF7] min-h-screen">
      {/* Hero */}
      <section className="relative py-8 overflow-hidden bg-gradient-to-br from-[#0a1929] via-brand to-[#0a1929]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,150,78,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(184,150,78,0.14),transparent_50%)]" />

        <div className="relative max-w-3xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[13px] font-bold uppercase tracking-[0.22em] text-gold"
          >
            About us
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            We're on a mission to give you your time back
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[15px] text-white/70 leading-relaxed max-w-xl mx-auto"
          >
            Yes Laundry started with a simple idea: laundry shouldn't cost you
            an evening. Here's who we are and why we do this.
          </motion.p>
        </div>
      </section>

      {/* Our story */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[320px] md:h-[420px] rounded-[1.75rem] overflow-hidden shadow-[0_20px_50px_-20px_rgba(10,25,41,0.4)]"
          >
            <Image
              src="/images/family.jpg"
              alt="The Yes Laundry team at work"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/60 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col gap-5"
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-gold">
              Our story
            </span>
            <h2 className="text-3xl md:text-[34px] font-semibold text-paragraph tracking-tight leading-[1.15]">
              Founded in Accra, built for real life
            </h2>
            <p className="text-[14.5px] text-[#5a6472] leading-relaxed">
              Yes Laundry began with a small team, a handful of neighborhoods in
              Accra, and a frustration we all shared: laundry always seemed to
              eat the one free afternoon we had. We built the service we wished
              existed — simple booking, dependable pickup windows, and cleaning
              that actually respects your clothes.
            </p>
            <p className="text-[14.5px] text-[#5a6472] leading-relaxed">
              Today we serve families, students, and businesses across Accra and
              beyond, but the goal hasn't changed — hand us the laundry, get
              your time back.
            </p>

            <ul className="flex flex-col gap-3 mt-2">
              {differentiators.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <CheckCircle2
                    size={16}
                    className="text-brand font-bold mt-[2] shrink-0"
                    strokeWidth={2}
                  />
                  <span className="text-[13.5px] text-paragraph">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 md:py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-gold">
              What we stand for
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-paragraph tracking-tight">
              Our values
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  variants={fadeUp}
                  className="flex flex-col gap-4 p-6 rounded-2xl bg-[#FBFAF7] border border-black/[0.04] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_-18px_rgba(10,25,41,0.25)]"
                >
                  <span className="flex items-center justify-center h-11 w-11 rounded-full bg-gradient-to-br from-brand to-[#0a1929] text-white">
                    <Icon size={18} strokeWidth={1.8} />
                  </span>
                  <h3 className="text-[15px] font-semibold text-paragraph">
                    {value.title}
                  </h3>
                  <p className="text-[13px] text-[#5a6472] leading-relaxed">
                    {value.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Stats band */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0a1929] via-brand to-[#0a1929] py-14 md:py-16 px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(184,150,78,0.14),transparent_60%)]" />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
          className="relative max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8"
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={fadeUp}
              className="text-center"
            >
              <p className="text-3xl md:text-4xl font-semibold text-white tracking-tight">
                {stat.value}
              </p>
              <p className="mt-1.5 text-[12px] text-white/60 uppercase tracking-[0.12em]">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-xl mx-auto mb-12"
          >
            <span className="text-[13px] font-bold uppercase tracking-[0.2em] text-gold">
              Behind the scenes
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-paragraph tracking-tight">
              The people making it happen
            </h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.1 } },
            }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {team.map((member) => (
              <motion.div
                key={member.name}
                variants={fadeUp}
                className="flex flex-col items-center text-center gap-3 p-6 rounded-2xl bg-white border border-black/[0.04] shadow-[0_10px_30px_-18px_rgba(10,25,41,0.18)] transition-all duration-300 hover:-translate-y-1"
              >
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand to-gold flex items-center justify-center ring-4 ring-[#FBFAF7]">
                  <span className="text-[14px] font-semibold text-white tracking-wide">
                    {member.initials}
                  </span>
                </div>
                <div>
                  <p className="text-[14px] font-semibold text-paragraph">
                    {member.name}
                  </p>
                  <p className="text-[12px] text-[#5a6472] mt-0.5">
                    {member.role}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Coverage */}
      <section className="pb-16 md:pb-24 px-6">
        <div className="max-w-4xl mx-auto rounded-[1.75rem] bg-white border border-black/[0.04] shadow-[0_10px_30px_-16px_rgba(10,25,41,0.18)] p-8 flex flex-col md:flex-row items-center gap-8">
          <div className="flex items-center gap-2 shrink-0">
            <MapPin size={18} />
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-brand/70">
              Where we operate
            </p>
          </div>
          <div className="flex flex-col sm:flex-row sm:gap-10">
            {locations.map((loc) => (
              <div key={loc.city}>
                <p className="text-[15px] font-semibold text-paragraph">
                  {loc.city}
                </p>
                <p className="text-[12.5px] text-[#5a6472]">{loc.address}</p>
                <p className="text-[12.5px] text-[#5a6472]">GPS: {loc.gps}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a1929] via-brand to-[#0a1929] px-8 py-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(184,150,78,0.2),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight max-w-md">
              Ready to see the difference for yourself?
            </h2>
            <Link
              href="/booking"
              className="flex items-center gap-2 bg-gradient-to-r from-gold to-[#a4813f] text-white font-semibold text-[14px] px-8 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(184,150,78,0.6)]"
            >
              Start booking
              <ArrowRight
                size={15}
                className="transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
