import { Suspense } from "react";
import Image from "next/image";
import {
  Star,
  PackageCheck,
  Clock,
  ShieldCheck,
  Lock,
  Radar,
  Quote,
} from "lucide-react";
import BookingForm from "@/components/form/BookingForm";

const stats = [
  { icon: PackageCheck, value: "15,000+", label: "Orders delivered" },
  { icon: Clock, value: "98%", label: "On-time delivery" },
  { icon: Star, value: "4.9/5", label: "Average rating" },
];

const trustPoints = [
  {
    icon: ShieldCheck,
    title: "Free re-clean guarantee",
    description: "Not happy with an item? We'll re-clean it at no cost.",
  },
  {
    icon: Lock,
    title: "Secure payment",
    description: "Pay by mobile money, card, or cash on delivery.",
  },
  {
    icon: Radar,
    title: "Live order tracking",
    description: "Know exactly where your laundry is, every step.",
  },
];

export default function BookPage() {
  return (
    <main className="bg-[#FBFAF7] min-h-screen">
      {/* Hero */}
      <section className="relative pt-10 py-9 overflow-hidden bg-linear-to-br from-brand via-brand to-paragraph">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(184,150,78,0.18),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(184,150,78,0.14),transparent_50%)]" />

        <div className="relative max-w-3xl mx-auto px-6 py-16 md:py-20 text-center">
          <span className="text-[13px] font-bold uppercase tracking-[0.22em] text-gold">
            Schedule a pickup
          </span>
          <h1 className="mt-4 text-3xl md:text-[42px] font-semibold text-white tracking-tight leading-[1.1]">
            Give yourself the gift of time back
          </h1>
          <p className="mt-4 text-[14.5px] md:text-[15px] text-white/70 leading-relaxed max-w-lg mx-auto">
            Every hour you don't spend on laundry is an hour spent on what
            actually matters. Book your first pickup and feel the difference.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:max-w-3xl md:mx-auto">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-10 lg:gap-14">
          <div className="flex flex-col gap-6 lg:sticky lg:top-10 lg:self-start">
            <div className="relative h-[300] md:h-[340] rounded-[1.75rem] overflow-hidden shadow-[0_20px_50px_-20px_rgba(10,25,41,0.4)]">
              <Image
                src="/images/best.jpg"
                alt="Fresh, folded laundry ready for delivery"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-paragraph/90 via-paragraph/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <Quote
                  className="text-gold mb-2 font-bold"
                  size={22}
                  fill="currentColor"
                  strokeWidth={0}
                />
                <p className="text-white text-[15px] md:text-[16px] font-medium leading-relaxed italic">
                  "I used to lose half my Saturday to laundry. Now it just
                  happens. Best decision I made this year."
                </p>
                <p className="mt-2 text-[12.5px] text-white/80">
                  Ama O. — East Legon, Accra
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3">
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center text-center gap-1.5 rounded-2xl bg-white border border-black/4 shadow-[0_10px_24px_-16px_rgba(10,25,41,0.2)] py-4 px-2"
                  >
                    <Icon size={16} className="text-gold" strokeWidth={1.8} />
                    <span className="text-[16px] font-semibold text-paragraph">
                      {stat.value}
                    </span>
                    <span className="text-[10.5px] text-[#8a92a0] leading-tight">
                      {stat.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Trust points */}
            <div className="rounded-2xl bg-white border border-black/4 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.18)] p-5 flex flex-col gap-4">
              {trustPoints.map((point) => {
                const Icon = point.icon;
                return (
                  <div key={point.title} className="flex items-start gap-3">
                    <span className="flex items-center justify-center h-9 w-9 shrink-0 rounded-full bg-linear-to-br from-brand to-paragraph text-white">
                      <Icon size={15} strokeWidth={1.8} />
                    </span>
                    <div>
                      <p className="text-[13.5px] font-semibold text-paragraph">
                        {point.title}
                      </p>
                      <p className="text-[12px] text-[#5a6472] leading-relaxed mt-0.5">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <p className="text-center text-[12.5px] text-[#8a92a0]">
              Loved by families and businesses across Accra and beyond
            </p>
          </div>

          {/* Right: form */}
          <Suspense fallback={null}>
            <div className="">
              <BookingForm />
            </div>
          </Suspense>
        </div>
      </section>
    </main>
  );
}
