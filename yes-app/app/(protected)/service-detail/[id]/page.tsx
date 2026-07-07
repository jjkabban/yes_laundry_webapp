import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Check,
  Shirt,
  Layers,
  Ban,
  Droplets,
  PackageCheck,
  Truck,
  WashingMachine,
  Building2,
  Timer,
  Info,
} from "lucide-react";
import ServicePolicyAccordion from "@/components/components/ServicePolicyAccordion";
import { getServices, getServiceById } from "@/lib/api/service.server";
import { getServiceStats, ServiceStats } from "@/data/pages/service.general";
import Icon from "@/components/icons/LucideIcons";
import { FloatingButton } from "@/components/components/FloatingButton";
import { TopHeader } from "@/components/ui/TopHeader";

export async function generateStaticParams() {
  try {
    const res = await getServices();
    const services = res.data ?? [];

    return services.map((service) => ({
      id: service.id.toString(),
    }));
  } catch {
    return [];
  }
}

const whatsIncluded = [
  "Washing with premium detergent",
  "Professional folding of each item",
  "Free pickup & delivery to your door",
  "Garment-by-garment sorting by colour",
  "Packaged in reusable laundry bags",
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const res = await getServiceById(id);
  const service = res.data;
  const serviceStats = ServiceStats;

  if (!service) {
    console.log("No match found for:", id);
    notFound();
  }

  return (
    <main className="bg-[#FBFAF7] min-h-screen pb-28">
      {/* Hero image with header floating on top of it — no gap, no overlap */}
      <section className="relative h-[38vh] min-h-[300px] max-h-[420px] w-full overflow-hidden">
        <Image
          src={service.coverImage?.url ?? getServiceStats(service.slug).image}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/90 via-[#0a1929]/25 to-[#0a1929]/40" />

        {/* Header sits inside the hero, absolutely positioned — this is the fix */}
        <div className="absolute top-0 left-0 right-0 z-10">
          <TopHeader />
        </div>

        <div className="relative h-full max-w-6xl mx-auto px-5 flex flex-col justify-end pb-7">
          <span className="flex items-center justify-center h-11 w-11 rounded-full bg-brand ring-1 ring-white/20 mb-4">
            <Icon
              name={service.icon as keyof typeof Icon}
              size={19}
              className="text-white"
              strokeWidth={1.8}
            />
          </span>
          <h1 className="text-[28px] leading-[1.1] md:text-5xl font-semibold text-white tracking-tight">
            {service.title}
          </h1>
          <p className="mt-2.5 text-[14px] md:text-[16px] text-white/80 leading-relaxed max-w-lg">
            {service.contextDescription ?? serviceStats[service.slug]}
          </p>
        </div>
      </section>

      {/* Pricing + turnaround, pulled up to overlap the hero slightly for depth */}
      <section className="relative z-10 mx-5 -mt-5">
        <div className="bg-white rounded-2xl shadow-[0_12px_30px_-14px_rgba(10,25,41,0.2)] px-5 py-4 flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#8a92a0] uppercase tracking-wide">
              From
            </span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-[22px] font-bold text-paragraph">
                GH₵{service.basePrice}
              </span>
              <span className="text-[13px] text-[#8a92a0]">
                {service.priceModel === "PER_ITEM" ? "per item" : "per bag"}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5">
            <Timer size={14} className="text-emerald-700" />
            <span className="text-[12.5px] font-semibold text-emerald-700">
              {service.turnaroundTime}
            </span>
          </div>
        </div>
      </section>

      <div className="mx-5 mt-3 flex items-start gap-2.5 bg-brand/6 border border-brand/15 rounded-xl px-3.5 py-3">
        <Timer size={16} className="text-brand mt-0.5 shrink-0" />
        <p className="text-[13.5px] text-[#5a6472] leading-snug">
          Items are ready within{" "}
          <span className="font-semibold text-paragraph">
            {service.turnaroundTime}
          </span>{" "}
          of pickup
        </p>
      </div>

      {/* Content — single column, since there's no sticky sidebar on this page */}
      <section className="py-10 px-5 max-w-2xl mx-auto">
        <div className="flex flex-col gap-12">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              Overview
            </span>
            <h2 className="mt-2 text-[22px] font-semibold text-paragraph tracking-tight">
              About this service
            </h2>
            <p className="mt-3 text-[14px] text-[#5a6472] leading-relaxed">
              {service.description}
            </p>
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
              Included
            </span>
            <h2 className="mt-2 text-[22px] font-semibold text-paragraph tracking-tight">
              What's included
            </h2>
            <div className="mt-5 flex flex-col">
              {whatsIncluded.map((item, index) => (
                <div
                  key={item}
                  className={`flex items-center gap-3 py-3.5 ${
                    index !== whatsIncluded.length - 1
                      ? "border-b border-paragraph/8"
                      : ""
                  }`}
                >
                  <span className="flex items-center justify-center h-7 w-7 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span className="text-[13.5px] text-[#5a6472]">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {service.handleAndCare?.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                Care
              </span>
              <h2 className="mt-2 text-[22px] font-semibold text-paragraph tracking-tight">
                Care and handling
              </h2>
              <div className="mt-5 flex flex-col">
                {service.handleAndCare.map((c, index) => (
                  <div
                    key={c.title}
                    className={`flex items-center gap-3.5 py-3.5 ${
                      index !== service.handleAndCare.length - 1
                        ? "border-b border-paragraph/8"
                        : ""
                    }`}
                  >
                    <span className="flex items-center justify-center h-9 w-9 rounded-full bg-brand/8 text-brand shrink-0">
                      <Icon
                        name={c.icon as keyof typeof Icon}
                        size={16}
                        strokeWidth={1.8}
                      />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-paragraph">
                        {c.title}
                      </p>
                      <p className="text-[12px] text-[#8a92a0]">
                        {c.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {service.howItWorks?.length > 0 && (
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                The process
              </span>
              <h2 className="mt-2 text-[22px] font-semibold text-paragraph tracking-tight">
                How it works
              </h2>

              <div className="relative mt-8 flex flex-col gap-8">
                <div className="absolute left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand/20 via-emerald-500/40 to-brand/20" />
                {service.howItWorks.map((step, i) => (
                  <div key={step.title} className="relative flex gap-4">
                    <span className="relative z-10 flex items-center justify-center h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-brand to-[#0a1929] text-white shadow-[0_10px_24px_-8px_rgba(10,25,41,0.45)] ring-4 ring-[#FBFAF7]">
                      <Icon
                        name={step.icon as keyof typeof Icon}
                        size={19}
                        strokeWidth={1.8}
                      />
                    </span>
                    <div className="flex-1 pt-1">
                      <span className="text-[11.5px] font-semibold text-emerald-600/80 tracking-[0.1em]">
                        STEP {i + 1}
                      </span>
                      <h3 className="mt-0.5 text-[15.5px] font-semibold text-paragraph">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-[13px] text-[#5a6472] leading-relaxed">
                        {step.description}
                      </p>
                      <div className="relative h-32 w-full mt-3 rounded-xl overflow-hidden">
                        <Image
                          src={step.image}
                          alt={step.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              Fine print
            </span>
            <h2 className="mt-2 text-[22px] font-semibold text-paragraph tracking-tight">
              Service policies
            </h2>
            <div className="mt-5">
              <ServicePolicyAccordion policies={service.policies} />
            </div>
          </div>
        </div>

        {service.priceModel === "PER_ITEM" && (
          <div className="mt-10 flex items-start gap-2.5 bg-brand/6 border border-brand/15 rounded-xl px-3.5 py-3">
            <Info size={16} className="text-brand mt-0.5 shrink-0" />
            <p className="text-[13px] text-[#5a6472] leading-snug">
              Price is calculated from the items you select at checkout.
            </p>
          </div>
        )}
      </section>

      <FloatingButton
        title={service.title}
        price={service.basePrice}
        priceModel={service.priceModel}
        turnaroundTime={service.turnaroundTime}
      />
    </main>
  );
}
