"use client";

import { FormFAB } from "@/components/FAB";
import { Footer } from "@/components/navigation";
import {
  HeroSection,
  TestimonialSection,
  TrustSection,
  ServiceSection,
  FinalCTASection,
  SchedulePickupSection,
} from "@/components/sections";
import { useServices } from "@/hooks/useServices";
import { AnimatePresence } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { SERVICES } from "../../data/objects/services";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);
  const { data, isLoading, isError } = useServices();
  const services =
    data?.data ?? (process.env.NODE_ENV === "development" ? SERVICES : []);

  useEffect(() => {
    const onPageScroll = () => {
      setScrollY(window.scrollY);
    };

    onPageScroll();
    window.addEventListener("scroll", onPageScroll);

    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);

  return (
    <div className="bg-background relative">
      <HeroSection scrollPosition={scrollY} />
      <TrustSection />
      <Suspense fallback="getting services....">
        <ServiceSection services={services} />
      </Suspense>

      <TestimonialSection />
      <SchedulePickupSection />
      <FinalCTASection />
      <AnimatePresence>{scrollY > 500 && <FormFAB />}</AnimatePresence>
      <Footer />
    </div>
  );
}
