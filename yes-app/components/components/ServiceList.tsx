import { Service } from "@/context/types/service";
import { Timer } from "lucide-react";
import Image from "next/image";

type Props = {
  services: Service[];
};

export default function ServiceList({ services }: Props) {
  return (
    <div className="md:my-10">
      <div className="px-5 pt-4">
        <h3 className="font-semibold text-xl md:text-xl py-3">
          Explore our services
        </h3>
      </div>

      <div className="mx-4 flex flex-col md:flex-row md:flex-wrap gap-5 md:gap-8 md:grid md:grid-cols-3">
        {services.map((service, index) => {
          const priceModel = service.priceModel;
          const price =
            priceModel === "BY_WEIGHT" || priceModel === "PER_BAG"
              ? `GHS${service.basePrice} per bag`
              : priceModel === "PER_ITEM"
                ? `GHS${service.basePrice} per item`
                : null;

          return (
            <div
              key={service.id}
              className="md:grow md:shrink bg-white shadow-sm rounded-md"
            >
              <div className="relative h-[160] w-full overflow-hidden rounded-t-md">
                <Image
                  src={`/images/s${index}.jpg`}
                  alt="service_image"
                  fill
                  className="object-cover"
                />
              </div>

              <div className="py-3 leading-tight px-2">
                <div className="flex justify-between pb-1">
                  <h4 className="font-semibold text-[15px]">{service.title}</h4>
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
                  <span className="pt-4 text-[13px] font-semibold text-paragraph">{` ${price}`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
