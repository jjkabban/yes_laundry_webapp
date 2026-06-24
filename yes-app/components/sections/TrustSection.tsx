"use client";
import {
  motion,
  type Variants,
  useInView,
  AnimatePresence,
} from "motion/react";
import { useRef, useState } from "react";
import { Zap, Sparkles, ShieldCheck, Award, ChevronDown } from "lucide-react";
import { summary } from "motion/react-client";

interface TrustIndicator {
  icon: React.ElementType;
  title: string;
  summary: string;
}

const trustIndicators: TrustIndicator[] = [
  {
    icon: Zap,
    title: "Fast pickup",
    summary: "Schedule in seconds and we're at your door.",
  },
  {
    icon: Sparkles,
    title: "Quality cleaning",
    summary: "Expert care for every fabric we handle.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    summary: "Pay your way with any payment method.",
  },
  {
    icon: Award,
    title: "Trusted service",
    summary: "Thousands of happy customers have proven it.",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function TrustSection() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section ref={sectionRef} className="relative py-8 px-6 overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#b8964e]/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mb-3"
        >
          <h3 className="text-[16px]block mb-2 font-bold uppercase tracking-[0.15em] font-poppins">
            Your Trusted Laundry Partner
          </h3>
          <p className="font-sans text-md text-paragraph tracking-tight">
            At YesLaundry, we take care of your laundry so you can focus on what
            matters most—while enjoying fresh, clean clothes every time.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="flex flex-col rounded-xl gap-2 xl:grid xl:grid-cols-2 xl:gap-4 xl:mt-8"
        >
          {trustIndicators.map((item, index) => {
            const Icon = item.icon;
            const isOpen = openIndex === index;

            return (
              <motion.div key={item.title} variants={itemVariants}>
                <div className="w-full flex items-center justify-between px-5 py-4 text-left bg-white   shadow-sm rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="flex justify-center items-center rounded-xl bg-[#0d6efd]/4 border border-[#b8964e]/20  px-4 py-5">
                      <Icon
                        size={24}
                        className="text-[#0d6efd]"
                        strokeWidth={1.8}
                      />
                    </div>
                    <div>
                      <span className="text-md font-medium text-black block">
                        {item.title}
                      </span>
                      <span className="text-sm text-paragraph/70">
                        {item.summary}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
