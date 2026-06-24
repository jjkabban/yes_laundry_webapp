"use client";
import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Shirt,
  WashingMachine,
  Footprints,
  Sparkles,
} from "lucide-react";
import HowItWorksSection from "./HowItWorkSection";

interface Service {
  title: string;
  description: string;
  image: string;
  summary: string;
}

const services: Service[] = [
  {
    title: "Stain Treatment",
    summary: "Removes tough stains and restores freshness.",
    description:
      "Advanced techniques to remove stubborn stains while protecting your fabrics.",
    image: "/images/wash.jpg",
  },
  {
    title: "Pressing & Ironing",
    summary: "Perfectly pressed garments, ready to wear.",
    description:
      "Professional ironing that leaves your clothes crisp and wrinkle-free.",
    image: "/images/wash1.jpg",
  },
  {
    title: "Dry Cleaning",
    summary: "Special care for delicate and premium fabrics.",
    description:
      "Expert cleaning for suits, silk, wool, and other delicate garments.",
    image: "/images/wash.jpg",
  },
  {
    title: "Personal Laundry",
    summary: "Convenient laundry care for your everyday needs.",
    description:
      "Washing, drying, and folding services handled with care and attention.",
    image: "/images/wash.jpg",
  },
  {
    title: "Family Laundry",
    summary: "Laundry solutions for the whole household.",
    description:
      "Reliable care for your family's clothes, linens, and essentials.",
    image: "/images/wash2.jpg",
  },
  {
    title: "Commercial Laundry",
    summary: "Professional laundry services for businesses.",
    description:
      "Efficient, high-quality laundering tailored to your business needs.",
    image: "/images/wash2.jpg",
  },
];

const floatingChips = [
  {
    icon: WashingMachine,
    label: "Wash & Fold",
    position: "top-7 left-7",
    delay: 0.1,
  },
  { icon: Sparkles, label: "Ironing", position: "top-7 right-7", delay: 0.25 },
  {
    icon: Shirt,
    label: "Dry Cleaning",
    position: "bottom-7 left-7",
    delay: 0.4,
  },
  {
    icon: Footprints,
    label: "Shoe Care",
    position: "bottom-7 right-7",
    delay: 0.55,
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServiceSection() {
  const showcaseRef = useRef(null);
  const gridRef = useRef(null);
  const isShowcaseInView = useInView(showcaseRef, { once: true, amount: 0.2 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });

  return (
    <>
      <section className="pt-5">
        <div className="max-w-5xl xl:max-w-full">
          <div
            ref={showcaseRef}
            className="overflow-hidden bg-brand/80 xl:h-150 xl:items-center xl:flex px-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] max-w-7xl mx-auto px-4 sm:px-6 md:gap-10   items-center justify-between gap-1 overflow-hidden xl:gap-10 w-full">
              <div className="relative h-[340] md:h-[500] xl:h-[400] my-4 p-2 overflow-hidden rounded-xl">
                <Image
                  src="/images/wash.jpg"
                  alt="Laundry service"
                  fill
                  className="object-cover rounded-sm"
                />
                <div className="absolute inset-0 bg-linear-to-br from-[#0a1929]/15 to-[#0a1929]/45" />
              </div>

              <div className="flex flex-col justify-start gap-5 py-5">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                  Premium care, every time
                </span>
                <h2 className="text-3xl md:text-[38px] font-semibold text-white tracking-tight leading-[1.15]">
                  We offer the best services in town
                </h2>
                <p className="text-sm md:text-[14.5px] text-white leading-relaxed max-w-sm xl:max-w-xl">
                  From everyday essentials to delicate fabrics, our highly
                  skilled team and advanced modern equipment ensure spotless,
                  fresh, and professionally treated results every single time.
                  Each garment is carefully inspected before cleaning, sorted
                  according to fabric type, and treated using the most suitable
                  eco-friendly methods available. We focus not just on
                  cleanliness, but also on preserving the texture, color, and
                  lifespan of your clothes, so they return to you feeling
                  renewed, comfortable, and perfectly cared for.
                </p>
                <div className="flex mx-auto gap-3 flex-wrap mt-1.5 xl:flex-row w-full xl:flex-nowrap">
                  <button className="xl:w-1/2 border border-white text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:border-white hover:-translate-y-0.5 w-full">
                    Explore services
                  </button>
                  <button className=" xl:w-1/2 flex flex-row items-center justify-center gap-2 bg-white text-[#0a1929] font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 border-[#474343] border-[1] w-full">
                    Start booking
                    <ArrowRight
                      size={15}
                      className="transition-transform duration-300"
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div>
        <HowItWorksSection />
      </div>

      <section className="py-16 md:py-20 px-6 ">
        <div className="max-w-7xl mx-auto">
          <div className="mb-11 flex flex-col justify-center items-center">
            <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-gold ">
              What we offer
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-paragraph tracking-tight">
              Our services
            </h2>
            <p className="mt-3.5 text-sm md:text-base text-[#5a6472] leading-relaxed max-w-xl text-center">
              Compare our full range of services at a glance and find exactly
              what fits your needs.
            </p>
          </div>

          <motion.div
            ref={gridRef}
            variants={containerVariants}
            initial="hidden"
            animate={isGridInView ? "visible" : "hidden"}
            className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-4 xl:gap-3"
          >
            {services.map((service) => (
              <motion.div
                whileHover={{ scale: 1.03 }}
                key={service.title}
                variants={cardVariants}
                className="rounded-2xl px-3 py-2 xl:mb-4 cursor-pointer shadow-[0_4px_16px_rgba(10,25,41,0.08)]"
              >
                <div className="h-[180] overflow-hidden rounded-xl relative">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover transition-transform duration-600 
                    w-full h-full
                    ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:brightness-[0.6]"
                  />
                </div>

                <div className="py-2">
                  <h3 className="text-[18px] font-semibold text-black tracking-tight leading-tight pb-1">
                    {service.title}
                  </h3>
                  <p className="text-[14px]">{service.description}</p>
                  <div className="flex flex-col flex-wrap mt-1 items-start">
                    <button className="border border-white text-[14.5px] font-semibold text-brand py-3 rounded-full transition-all duration-300 hover:border-white hover:-translate-y-0.5 cursor-pointer">
                      See full details
                    </button>
                    <button className="flex flex-row  justify-center items-center gap-2 bg-white text-text text-[13.5px] font-semibold px-4 py-2 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 border-[#474343] border-[1] cursor-pointer w-full ">
                      Book now
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </>
  );
}
