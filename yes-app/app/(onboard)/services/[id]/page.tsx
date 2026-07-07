import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  Clock,
  ChevronRight,
  ShieldCheck,
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
} from "lucide-react";
import ServicePolicyAccordion from "@/components/components/ServicePolicyAccordion";
import { getServices, getServiceById } from "@/lib/api/service.server";
import { getServiceStats, ServiceStats } from "@/data/pages/service.general";
import Icon from "@/components/icons/LucideIcons";

export async function generateStaticParams() {
  try {
    const res = await getServices();
    const services = res.data ?? [];

    return services.map((service) => ({
      id: service.id.toString(),
    }));
  } catch (err) {
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

const careAndHandling = [
  {
    icon: Shirt,
    title: "Gentle Wash",
    description: "Soft wash cycles for delicate fabrics",
  },
  {
    icon: Layers,
    title: "Fabric Separation",
    description: "We separate whites, colors, and darks",
  },
  {
    icon: Ban,
    title: "No Harsh Chemicals",
    description: "No bleach on colored or sensitive items",
  },
  {
    icon: Droplets,
    title: "Careful Cleaning",
    description: "Professionally cleaned with fabric safety in mind",
  },
  {
    icon: PackageCheck,
    title: "Handled with Care",
    description: "Every item is checked during pickup and delivery",
  },
];

const howItWorks = [
  {
    icon: Truck,
    title: "We collect your clothes",
    description:
      "Our driver arrives at your scheduled pickup window and collects your laundry bag.",
    image: "/images/work1.jpg",
  },
  {
    icon: Shirt,
    title: "Sort & inspect",
    description:
      "We sort your items by colour and fabric type, and check for any special care labels.",
    image: "/images/work2.jpg",
  },
  {
    icon: WashingMachine,
    title: "Wash & fold",
    description:
      "Each load is washed at the right temperature, dried, and neatly folded by our team.",
    image: "/images/work3.jpg",
  },
  {
    icon: Building2,
    title: "Delivered to your door",
    description:
      "Your fresh laundry is packaged and returned within 24–48 hours of pickup.",
    image: "/images/work4.jpg",
  },
];

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const allResponse = await getServices();
  const allServices = allResponse.data;
  const res = await getServiceById(id);
  const service = res.data;

  const serviceStats = ServiceStats;

  if (!service) {
    console.log("No match found for:", id);
    notFound();
  }

  const others = allServices?.filter((s) => s.slug !== service.slug);

  return (
    <main className="bg-[#FBFAF7] min-h-screen">
      {/* Hero — unchanged */}
      <section className="relative h-[40vh] min-h-[460] max-h-[640] w-full overflow-hidden">
        <Image
          src={service.coverImage?.url ?? getServiceStats(service.slug).image}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/95 via-[#0a1929]/40 to-[#0a1929]/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1929]/50 via-transparent to-transparent" />

        <div className="relative h-full max-w-6xl mx-auto px-6 flex flex-col justify-between py-8">
          <nav className="flex items-center gap-1.5 text-[12.5px] text-white/70">
            <Link href="/" className="hover:text-emerald-400 transition-colors">
              Home
            </Link>
            <ChevronRight size={13} />
            <Link
              href="/services"
              className="hover:text-emerald-400 transition-colors"
            >
              Services
            </Link>
            <ChevronRight size={13} />
            <span className="text-white">{service.title}</span>
          </nav>

          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex items-center justify-center h-12 w-12 rounded-full bg-brand backdrop-blur-sm ring-1 ring-brand/20">
                <Icon
                  name={service.icon as keyof typeof Icon}
                  size={20}
                  className="text-white"
                  strokeWidth={1.8}
                />
              </span>
            </div>

            <h1 className="text-4xl leading-tight md:text-6xl font-semibold text-white tracking-tight leading-[1.05]">
              {service.title}
            </h1>
            <p className="mt-4 text-[15px] md:text-[18px] text-white/85 leading-relaxed max-w-lg">
              {service.contextDescription ?? serviceStats[service.slug]}
            </p>

            <Link
              href="/signin"
              className="mt-7 inline-flex items-center gap-2 bg-gradient-to-r from-brand to-[#2D6FB8] text-white font-semibold text-[16px] px-7 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(0,74,148,0.5)]"
            >
              Book this service
              <ArrowRight
                size={15}
                className="transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-5 mt-4 flex justify-between ">
        <div className="font pt-2 flex items-center gap-2">
          <span className="text-black/60 self-end">From</span>
          <span className="text-xl font-bold">GHS{service.basePrice}</span>
          <span>
            {service.priceModel === "PER_ITEM" ? "per item" : "per bag"}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <Timer size={20} />
          <span>{service.turnaroundTime}</span>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 px-6 md:max-w-2xl mx-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-12 lg:gap-16">
          {/* Left column */}
          <div className="flex flex-col gap-14">
            {/* Overview */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                Overview
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
                About this service
              </h2>
              <p className="mt-4 text-[14.5px] text-[#5a6472] leading-relaxed max-w-xl">
                {service.description}
              </p>
            </div>

            {/* What's included */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-emerald-600">
                Included
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
                What's included
              </h2>
              <div className="mt-6 flex flex-col">
                {whatsIncluded.map((item, index) => (
                  <div
                    key={item}
                    className={`flex items-center gap-3 py-4 ${
                      index !== whatsIncluded.length - 1
                        ? "border-b border-paragraph/8"
                        : ""
                    }`}
                  >
                    <span className="flex items-center justify-center h-8 w-8 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="text-[14px] text-[#5a6472]">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Care and handling */}
            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                Care
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
                Care and handling
              </h2>
              <div className="mt-6 flex flex-col">
                {service.handleAndCare.map((c, index) => {
                  const CIcon = c.icon;
                  return (
                    <div
                      key={c.title}
                      className={`flex items-center gap-4 py-4 ${
                        index !== careAndHandling.length - 1
                          ? "border-b border-paragraph/8"
                          : ""
                      }`}
                    >
                      <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand/8 text-brand shrink-0">
                        <Icon
                          name={c.icon as keyof typeof Icon}
                          size={16}
                          strokeWidth={1.8}
                        />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-paragraph">
                          {c.title}
                        </p>
                        <p className="text-[12.5px] text-[#8a92a0]">
                          {c.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* How it works — with images, server colors */}
            {/* How it works — horizontal on lg+, stacked on mobile */}
            <div>
              <div className="text-center lg:text-left">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  The process
                </span>
                <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
                  How it works
                </h2>
              </div>

              <div className="relative mt-10 grid grid-cols-1 lg:grid-cols-4 gap-10 lg:gap-6">
                {/* horizontal connector line, lg+ only */}
                <div className="hidden lg:block absolute left-[12.5%] right-[12.5%] top-7 h-[2px] bg-gradient-to-r from-brand/20 via-emerald-500/40 to-brand/20" />
                {/* vertical connector line, mobile only */}
                <div className="lg:hidden absolute left-[27px] top-2 bottom-2 w-[2px] bg-gradient-to-b from-brand/20 via-emerald-500/40 to-brand/20" />

                {service.howItWorks.map((step, i) => {
                  const StepIcon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="relative flex lg:flex-col items-start lg:items-center gap-5 lg:gap-0 lg:text-center"
                    >
                      <span className="relative z-10 flex items-center justify-center h-14 w-14 shrink-0 rounded-full bg-gradient-to-br from-brand to-[#0a1929] text-white shadow-[0_10px_24px_-8px_rgba(10,25,41,0.45)] ring-4 ring-[#FBFAF7]">
                        <Icon
                          name={step.icon as keyof typeof Icon}
                          size={20}
                          strokeWidth={1.8}
                        />
                      </span>

                      <div className="pt-1.5 lg:pt-4 flex-1 lg:flex lg:flex-col lg:items-center">
                        <span className="text-[12px] font-semibold text-emerald-600/80 tracking-[0.1em]">
                          STEP {i + 1}
                        </span>
                        <h3 className="mt-0.5 text-[17px] font-semibold text-paragraph">
                          {step.title}
                        </h3>
                        <p className="mt-1.5 text-[13.5px] text-[#5a6472] leading-relaxed max-w-md lg:max-w-[220px]">
                          {step.description}
                        </p>
                        <div className="relative h-40 w-full max-w-md lg:max-w-none mt-4 rounded-xl overflow-hidden">
                          <Image
                            src={step.image}
                            alt={step.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                Fine print
              </span>
              <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
                Service policies
              </h2>
              <div className="mt-6">
                <ServicePolicyAccordion policies={service.policies} />
              </div>
            </div>
          </div>

          {/* Right: sticky booking card */}
          <div className="lg:sticky lg:top-10 lg:self-start">
            <div className="rounded-[1.75rem] bg-white border border-black/[0.04] shadow-[0_20px_50px_-24px_rgba(10,25,41,0.25)] overflow-hidden">
              <div className="p-6 flex flex-col gap-5">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand/70">
                    Pricing
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-paragraph">
                    From GH₵{service.basePrice}
                  </p>
                  <p className="mt-1 text-[12.5px] text-[#8a92a0]">
                    Final price depends on weight / piece count
                  </p>
                </div>

                <div className="h-px bg-paragraph/8" />

                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-brand/8 text-brand shrink-0">
                    <Clock size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-paragraph">
                      Turnaround
                    </p>
                    <p className="text-[12px] text-[#8a92a0]">
                      {service.turnaroundTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 shrink-0">
                    <ShieldCheck size={16} strokeWidth={1.8} />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold text-paragraph">
                      Free re-clean guarantee
                    </p>
                    <p className="text-[12px] text-[#8a92a0]">
                      Not satisfied? We'll make it right
                    </p>
                  </div>
                </div>

                <Link
                  href="/signin"
                  className="mt-1 flex items-center justify-center gap-2 bg-gradient-to-r from-brand to-[#0a1929] text-white font-semibold text-[14px] px-6 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(10,25,41,0.5)]"
                >
                  Book this service
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related services — unchanged */}
      <section className="pb-20 md:pb-28 px-6">
        <div className="max-w-6xl mx-auto">
          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gold">
            Explore more
          </span>
          <h2 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight mb-8">
            Other services you might need
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {others?.map((r) => {
              const RIcon = r.icon;
              return (
                <Link
                  key={r.slug}
                  href={`/services/${r.id}`}
                  className="group relative h-[200] rounded-2xl overflow-hidden shadow-[0_10px_30px_-16px_rgba(10,25,41,0.25)]"
                >
                  <Image
                    src={r.coverImage?.url ?? getServiceStats(r.slug).image}
                    alt={r.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1929]/90 via-[#0a1929]/20 to-transparent" />
                  <div className="absolute top-4 left-4 h-9 w-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center">
                    <Icon
                      name={r.icon as keyof typeof Icon}
                      size={15}
                      className="text-brand"
                      strokeWidth={1.8}
                    />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center justify-between">
                    <h3 className="text-[15px] font-semibold text-white">
                      {r.title}
                    </h3>
                    <ArrowRight
                      size={15}
                      className="text-brand transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
