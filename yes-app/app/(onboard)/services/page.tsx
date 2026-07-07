"use client";

import { motion } from "motion/react";
import {
  Droplets,
  Shirt,
  Gem,
  WashingMachine,
  Users,
  Building2,
  CalendarCheck,
  Sparkles,
  Truck,
  Wind,
  ShieldCheck,
  PackageCheck,
  ShoppingBag,
} from "lucide-react";
import ServiceDetailCard from "@/components/ui/ServiceDetailCard";
import { Service } from "@/types/shared/service.types";
import { useServices } from "@/hooks/useServices";

export default function ServicesPage() {
  const { data, isError, isLoading } = useServices();
  const services = data?.data;

  return (
    <main className="bg-[#FBFAF7] min-h-screen">
      {/* Hero */}
      <section className="relative py-5 overflow-hidden bg-linear-to-br from-paragraph via-brand to-paragraph">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,150,78,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(184,150,78,0.14),transparent_50%)]" />

        <div className="relative max-w-5xl mx-auto px-6 py-20 md:py-28 text-center">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-[13px] font-bold uppercase tracking-[0.22em] text-gold"
          >
            Full service menu
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-4 text-4xl md:text-5xl font-semibold text-white tracking-tight leading-[1.1]"
          >
            Every service, done with care
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-5 text-[15px] text-white/70 leading-relaxed max-w-xl mx-auto"
          >
            Tap into any service below to see exactly how it works, step by
            step, then book in seconds.
          </motion.p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7">
          {services?.map((service, i) => (
            <ServiceDetailCard key={service.slug} service={service} index={i} />
          ))}
        </div>
      </section>
    </main>
  );
}
