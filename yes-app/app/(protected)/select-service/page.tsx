"use client";

import { useServices } from "@/hooks/useServices";
import { getServices } from "@/lib/api/service.api";
import {
  ServicePriceModel,
  ServiceResponsePayload,
} from "@/lib/api/type/service.types";
import { ArrowLeft, Timer } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import mockServices from "../../../data/mock/services.json";
import Link from "next/link";
import CheckBox from "@/components/ui/CheckBox";
import { motion } from "framer-motion";
import { select } from "motion/react-client";
import { useRouter } from "next/navigation";

type SelectedType = {
  id: string;
  name: string;
  turnaround: string;
  price: string;
  priceModel: ServicePriceModel;
};
export default function SelectService() {
  const { data, isError, isLoading } = useServices();
  const [selected, setSelected] = useState<SelectedType | null>(null);
  const router = useRouter();

  const services =
    data?.data ?? (process.env.NODE_ENV === "development" ? mockServices : []);

  const onSelect = useCallback(
    (sld: SelectedType) => {
      setSelected(sld);
    },
    [selected],
  );

  return (
    <div className="bg-foreground">
      <div className="flex fixed top-0 left-0 right-0 bg-foreground z-20 gap-6 border-b-2 border-b-paragraph/10 p-3 pb-2 items-center">
        <button
          onClick={() => {
            router.back();
          }}
        >
          <ArrowLeft />
        </button>

        <div className="leading-1">
          <h3 className="text-xl font-medium leading-tight">
            Choose a service
          </h3>
          <span className="text-sm text-paragraph/80">
            Pick what works for your laundry
          </span>
        </div>
      </div>

      <div
        className={`mx-4 pt-22 pb-30 flex flex-col gap-5 xl:gap-8  md:grid  xl:grid-cols-3 overflow-hidden`}
      >
        {services?.map((service, index) => {
          const priceModel = service.priceModel;
          const price =
            priceModel === "BY_WEIGHT" || priceModel === "PER_BAG"
              ? `GHS${service.basePrice} per bag`
              : priceModel === "PER_ITEM"
                ? `GHS${service.basePrice} per item`
                : null;
          const isSelected = service.id === selected?.id;

          return (
            <motion.div
              whileTap={{ scale: 1.02 }}
              onClick={() => {
                onSelect({
                  id: service.id,
                  name: service.title,
                  turnaround: service.turnaroundTime,
                  price: price as string,
                  priceModel: service.priceModel as ServicePriceModel,
                });
              }}
              key={service.id + index}
              className="bg-white shadow-sm shrink-0 grow rounded-md min-w-0 border-2 border-paragraph/20 overflow-hidden"
            >
              <div className="relative h-[160] w-full overflow-hidden rounded-t-md">
                <Image
                  src={`/images/s${index}.jpg`}
                  alt="service_image"
                  fill
                  className="object-cover"
                />
                <CheckBox
                  checked={isSelected}
                  className="absolute top-2 right-2 h-6 w-6"
                />
              </div>

              <div className="py-3 leading-tight px-2">
                <div className="flex justify-between pb-1">
                  <h4 className="font-semibold text-[16px]">{service.title}</h4>
                  <div className=" flex flex-row gap-1 items-center justify-center px-2 ">
                    <Timer size={13} color="#444" />
                    <span className="text-paragraph text-[12px] self-center">
                      {service.turnaroundTime}
                    </span>
                  </div>
                </div>

                <p className="text-paragraph/80 text-sm md:text-[13px]">
                  {service.contextDescription}
                </p>
                <div className="pt-3">
                  <span className="pt-4 text-[12px] text-paragraph">From</span>
                  <span className="pt-4 text-[14px] font-semibold text-paragraph">{` ${price}`}</span>
                </div>

                <button
                  className="mt-3 self-end flex text-brand font-medium"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/service-detail?sid=${service.id}`);
                  }}
                >
                  See details
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* floating bar */}
      <div className="fixed flex border-t-2 border-t-paragraph/20 justify-between items-center bottom-0 left-0 right-0 bg-white px-5 pt-5 pb-6 rounded-2xl">
        <div>
          {selected ? (
            <div className="flex flex-col">
              <span className="font-medium">{selected.name}</span>
              <span className="text-[13px] text-paragraph/80">
                {selected.price} • {selected.turnaround}
              </span>
            </div>
          ) : (
            <div className="flex flex-col">
              <span className="font-medium">Select a service</span>
              <span className="text-sm text-paragraph/80">none selected</span>
            </div>
          )}
        </div>
        <button
          onClick={() =>
            router.push(
              `/booking?type=${selected?.priceModel}&sid=${selected?.id}`,
            )
          }
          disabled={!selected}
          className={`px-4 py-2 text-white font-medium rounded-full w-1/2 ${selected ? "bg-brand" : "bg-brandDim"}`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
