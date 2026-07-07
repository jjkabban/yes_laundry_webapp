"use client";
import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Droplets,
  Shirt,
  Gem,
  WashingMachine,
  Users,
  Building2,
} from "lucide-react";
import HowItWorksSection from "./HowItWorkSection";
import { useRouter } from "next/navigation";
import { Service } from "@/types/shared/service.types";
import Icon from "../icons/LucideIcons";
import { ServiceStats, getServiceStats } from "@/data/pages/service.general";

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

type Props = {
  services: Service[];
};

export default function ServiceSection({ services }: Props) {
  const showcaseRef = useRef(null);
  const gridRef = useRef(null);
  const isShowcaseInView = useInView(showcaseRef, { once: true, amount: 0.2 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.1 });
  const router = useRouter();

  return (
    <>
      <section className="pt-5">
        <div className="max-w-5xl xl:max-w-full">
          <div
            ref={showcaseRef}
            className="overflow-hidden py-4 bg-brand/90 xl:h-[600px] xl:items-center xl:flex px-2"
          >
            <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr] max-w-7xl mx-auto px-2 sm:px-6 md:gap-10 items-center justify-between gap-1 overflow-hidden xl:gap-10 w-full">
              <div className="relative h-[340px] md:h-[500px] xl:h-[400px] my-4 p-2 overflow-hidden rounded-xl">
                <Image
                  src="/images/best.jpg"
                  alt="Laundry service"
                  fill
                  className="object-cover rounded-sm"
                />
                <div className="absolute inset-0 bg-linear-to-br from-[#0a1929]/15 to-[#0a1929]/45" />
              </div>

              <div className="flex flex-col justify-start gap-5 py-5">
                <span className="text-[13px] text-gold font-bold uppercase tracking-[0.20em] ">
                  Premium care, every time
                </span>
                <h2 className="text-3xl md:text-[38px] font-semibold text-white tracking-tight leading-[1.15]">
                  We offer the best services in town
                </h2>
                <p className="text-[14px] md:text-[14.5px] text-white leading-relaxed max-w-sm xl:max-w-xl">
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
                  <button
                    onClick={() => {
                      router.push("services");
                    }}
                    className="xl:w-1/2 border border-white text-white font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:border-white hover:-translate-y-0.5 w-full"
                  >
                    Explore services
                  </button>
                  <button
                    onClick={() => {
                      router.push("signup");
                    }}
                    className="xl:w-1/2 flex flex-row items-center justify-center gap-2 bg-white text-[#0a1929] font-semibold px-6 py-3 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 border border-[#474343] w-full"
                  >
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

      <section className="py-16 md:py-24 px-6 bg-[#FBFAF7]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 flex flex-col justify-center items-center">
            <span className="text-[13px] font-bold uppercase tracking-[0.20em] text-brand">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-7"
          >
            {services.map((service) => {
              return (
                <motion.div
                  onClick={() => {
                    router.push(`services/${service.id}`);
                  }}
                  key={service.title}
                  variants={cardVariants}
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="group relative rounded-[1.75rem] overflow-hidden bg-white shadow-[0_10px_30px_-12px_rgba(10,25,41,0.18)] cursor-pointer"
                >
                  {/* Image with icon badge + gradient title overlay */}
                  <div className="relative h-[240px] overflow-hidden">
                    <Image
                      src={
                        service.coverImage?.url ??
                        getServiceStats(service.slug).image
                      }
                      alt={service.title}
                      fill
                      className="object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                    <div className="absolute top-4 left-4 h-11 w-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-sm">
                      <Icon
                        name={service.icon as keyof typeof Icon}
                        size={18}
                        className="text-brand"
                        strokeWidth={1.8}
                      />
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3 className="text-[19px] font-semibold text-white tracking-tight leading-tight">
                        {service.title}
                      </h3>
                      <p className="text-[12.5px] text-white/80 mt-0.5">
                        {service.contextDescription}
                      </p>
                    </div>
                  </div>

                  {/* Content panel */}
                  <div className="px-5 pt-4 pb-5">
                    <p className="text-[13.5px] text-[#5a6472] leading-relaxed">
                      {service.description}
                    </p>

                    <button
                      onClick={() => {
                        router.push("/signin");
                      }}
                      className="mt-4 w-full flex items-center gap-1.5 text-[13.5px] font-semibold text-brand transition-all duration-300 group-hover:gap-2.5"
                    >
                      Book now
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover:translate-x-0.5"
                      />
                    </button>
                  </div>

                  {/* accent underline that grows on hover */}
                  <div className="h-[3] bg-gold/70 w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </>
  );
}
