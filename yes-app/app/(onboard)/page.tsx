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
import { AnimatePresence } from "framer-motion";
import { handleAction } from "next/dist/server/app-render/action-handler";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  const onPageScroll = () => {
    setScrollY(window.scrollY);
  };

  useEffect(() => {
    onPageScroll();
    window.addEventListener("scroll", onPageScroll);
    return () => {
      window.removeEventListener("scroll", onPageScroll);
    };
  }, []);
  return (
    <div className="bg-background w-lvw relative">
      <HeroSection scrollPosition={scrollY} />
      <TrustSection />
      <ServiceSection />
      <TestimonialSection />
      <SchedulePickupSection />
      <FinalCTASection />
      <Footer />
      <AnimatePresence>{scrollY > 500 && <FormFAB />}</AnimatePresence>
    </div>
  );
}
