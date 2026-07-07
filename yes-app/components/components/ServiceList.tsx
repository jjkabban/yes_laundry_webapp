"use client";

import { usePanel } from "@/context/DashboardContext";
import { Service } from "@/types/shared/service.types";
import { ArrowRight, Timer } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Icon from "../icons/LucideIcons";

type Props = {
  services: Service[];
};

export default function ServiceList({ services }: Props) {
  const { openPanel } = usePanel();
  const router = useRouter();

  return (
    <div className="md:my-10">
      <div className="px-5 pt-4">
        <h3 className="font-semibold text-xl md:text-2xl pt-1 pb-1">
          Explore our services
        </h3>
      </div>

      <div
        className={`mx-4 mt-3 flex flex-col gap-5 xl:gap-7 md:grid ${
          openPanel ? "md:grid-cols-1" : "md:grid-cols-2"
        } xl:grid-cols-3`}
      >
        {services.map((service, index) => {
          const priceModel = service.priceModel;
          const priceLabel =
            priceModel === "BY_WEIGHT" || priceModel === "PER_BAG"
              ? "per bag"
              : "per item";

          return (
            <motion.div
              key={service.id + index}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => {
                router.push(`/service-detail/${service.id}`);
              }}
              className="group relative shrink-0 grow min-w-0 rounded-2xl overflow-hidden bg-white shadow-[0_10px_30px_-14px_rgba(10,25,41,0.22)] cursor-pointer"
            >
              {/* Image with gradient + floating badges */}
              <div className="relative h-[190] w-full overflow-hidden">
                <Image
                  src={service.coverImage?.url ?? `/images/s${index}.jpg`}
                  alt={service.title}
                  fill
                  className="object-cover transition-transform duration-[700] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/90 via-[#0a1929]/10 to-transparent" />

                {/* Turnaround badge, top-left */}
                <div className="absolute bottom-3 right-3 justify-center flex items-center gap-1 rounded-full bg-brand/90 backdrop-blur-lg p-2 ">
                  <Icon
                    name={
                      (service.icon as keyof typeof Icon) ?? "WashingMachine"
                    }
                    color="#fff"
                    size={20}
                  />
                </div>

                {/* Price badge, top-right — the eye-catching focal point */}
                <div className="flex items-center justify-center  gap-1 text-white absolute top-3 left-3 rounded-full bg-linear-to-r from-emerald-500 to-emerald-600 px-3 py-1 shadow-[0_4px_12px_-2px_rgba(16,185,129,0.5)]">
                  <span>
                    <Timer
                      size={13}
                      className="font-semibold"
                      strokeWidth={2}
                    />
                  </span>

                  <span className="text-[11px] font-semibold ">
                    {service.turnaroundTime}
                  </span>
                </div>

                {/* Title sits on the image */}
                <div className="absolute bottom-0 left-0 right-0 p-3.5">
                  <h4 className="text-[16.5px] font-semibold text-white leading-tight">
                    {service.title}
                  </h4>
                </div>
              </div>

              {/* Content */}
              <div className="px-3.5 pt-3 pb-3.5">
                <p className="text-[13px] text-[#5a6472] leading-relaxed line-clamp-2">
                  {service.contextDescription}
                </p>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px] text-paragraph">
                    From GH₵{service.basePrice}{" "}
                    <span className="text-[#8a92a0]">{priceLabel}</span>
                  </span>

                  <span className="flex items-center gap-1 text-[12.5px] font-semibold text-brand transition-all duration-300 group-hover:gap-1.5">
                    Book now
                    <ArrowRight
                      size={13}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </div>

              {/* Accent underline that grows on hover — signature detail */}
              <div className="h-[3px] bg-gradient-to-r from-brand to-emerald-500 w-0 group-hover:w-full transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]" />
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
