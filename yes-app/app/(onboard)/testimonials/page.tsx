"use client";
import { motion, useInView, type Variants } from "motion/react";
import { useRef } from "react";
import Link from "next/link";
import { Star, Quote, ArrowRight } from "lucide-react";

const testimonials = [
  {
    name: "Amara Osei",
    role: "Working mum",
    quote:
      "I used to dread laundry day. Now it's just... done. The team is always on time and my clothes come back perfectly folded.",
    rating: 5,
    initials: "AO",
  },
  {
    name: "Kofi Mensah",
    role: "Freelance designer",
    quote:
      "Scheduled my first pickup in under a minute. By the next morning my whole wardrobe was back, fresh. Genuinely impressed.",
    rating: 5,
    initials: "KM",
  },
  {
    name: "Esi Darko",
    role: "University student",
    quote:
      "Affordable, fast, and they handled my delicate fabrics without a single issue. Will never go back to doing it myself.",
    rating: 5,
    initials: "ED",
  },
  {
    name: "Nana Boateng",
    role: "Small business owner",
    quote:
      "We use Yes Laundry for our staff uniforms. Consistent quality every single week — exactly what we needed.",
    rating: 5,
    initials: "NB",
  },
  {
    name: "Abena Frimpong",
    role: "Healthcare worker",
    quote:
      "On 12-hour shifts, the last thing I want to do is laundry. This service has genuinely given me my evenings back.",
    rating: 5,
    initials: "AF",
  },
  {
    name: "Kwame Asante",
    role: "Teacher",
    quote:
      "Clean shirts, zero effort. I've recommended Yes Laundry to every colleague. The pickup experience is seamless.",
    rating: 5,
    initials: "KA",
  },
  {
    name: "Yaa Adjei",
    role: "Restaurant manager",
    quote:
      "We switched our linen service to Yes Laundry six months ago. Zero missed pickups, zero complaints from staff. It just works.",
    rating: 5,
    initials: "YA",
  },
  {
    name: "David Owusu",
    role: "Software engineer",
    quote:
      "The app makes booking painless and the tracking is genuinely accurate. Small thing, but it makes the whole experience feel premium.",
    rating: 4,
    initials: "DO",
  },
  {
    name: "Efua Sarpong",
    role: "New parent",
    quote:
      "Between the baby and work, laundry was the first thing to slide. Yes Laundry quietly took that whole problem off my plate.",
    rating: 5,
    initials: "ES",
  },
];

const ratingBreakdown = [
  { stars: 5, percent: 89 },
  { stars: 4, percent: 8 },
  { stars: 3, percent: 2 },
  { stars: 2, percent: 1 },
  { stars: 1, percent: 0 },
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function TestimonialCard({ t }: { t: (typeof testimonials)[0] }) {
  return (
    <motion.div
      variants={cardVariants}
      className="relative flex flex-col gap-4 p-7 rounded-[1.5rem] bg-white overflow-hidden ring-1 ring-[#0a1929]/8 shadow-[0_10px_30px_-16px_rgba(10,25,41,0.15)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_45px_-15px_rgba(0,74,148,0.18)] hover:ring-brand/25"
    >
      <Quote
        size={72}
        strokeWidth={0}
        className="absolute -top-2 -right-2 text-brand/10 fill-brand/10 pointer-events-none"
      />

      <div className="relative flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className={
              i < t.rating
                ? "text-emerald-600 fill-emerald-600"
                : "text-[#0a1929]/10 fill-[#0a1929]/10"
            }
          />
        ))}
      </div>

      <p className="relative text-[14px] text-[#3d4650] leading-relaxed flex-1 font-medium">
        {t.quote}
      </p>

      <div className="relative flex items-center gap-3 pt-4 border-t border-[#0a1929]/8">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-brand to-emerald-600 flex items-center justify-center shrink-0 ring-2 ring-brand/20">
          <span className="text-[11px] font-semibold text-white tracking-wide">
            {t.initials}
          </span>
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0a1929]">{t.name}</p>
          <p className="text-[11px] text-[#5a6472]">{t.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function TestimonialsPage() {
  const heroRef = useRef(null);
  const gridRef = useRef(null);
  const isHeroInView = useInView(heroRef, { once: true, amount: 0.2 });
  const isGridInView = useInView(gridRef, { once: true, amount: 0.05 });

  return (
    <main className="bg-white">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative py-30 md:py-28 bg-linear-to-b from-white to-brand/10 overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-brand/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.div
          className="relative max-w-2xl mx-auto text-center px-6"
          variants={headerVariants}
          initial="hidden"
          animate={isHeroInView ? "visible" : "hidden"}
        >
          <span className="text-[13px] font-bold uppercase tracking-[0.25em] text-brand">
            What customers say
          </span>
          <h1 className="mt-3 text-3xl md:text-5xl font-semibold text-paragraph tracking-tight leading-[1.1]">
            Thousands trust Yes Laundry
          </h1>
          <p className="mt-4 text-sm md:text-base text-[#5a6472] leading-relaxed">
            See why families and businesses across Accra and beyond keep coming
            back, in their own words.
          </p>
        </motion.div>

        {/* Rating summary */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
          className="relative max-w-3xl mx-auto mt-14 px-6"
        >
          <div className="rounded-[1.75rem] bg-white ring-1 ring-[#0a1929]/8 shadow-[0_20px_50px_-20px_rgba(10,25,41,0.2)] p-8 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-8 items-center">
            <div className="flex flex-col items-center sm:items-start sm:border-r sm:border-[#0a1929]/8 sm:pr-8">
              <span className="text-5xl font-semibold text-paragraph tracking-tight">
                4.9
              </span>
              <div className="flex gap-0.5 mt-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-emerald-600 fill-emerald-600"
                  />
                ))}
              </div>
              <p className="mt-2 text-[12.5px] text-[#5a6472] whitespace-nowrap">
                Based on 2,400+ reviews
              </p>
            </div>

            <div className="flex flex-col gap-2 w-full">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-3">
                  <span className="w-10 text-[11px] font-medium text-[#5a6472] shrink-0">
                    {row.stars} star
                  </span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#0a1929]/6 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand to-emerald-600"
                      style={{ width: `${row.percent}%` }}
                    />
                  </div>
                  <span className="w-8 text-[11px] text-[#5a6472] text-right shrink-0">
                    {row.percent}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Testimonial wall */}
      <section className="py-16 md:py-24 px-6">
        <motion.div
          ref={gridRef}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          initial="hidden"
          animate={isGridInView ? "visible" : "hidden"}
          className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="px-6 pb-24">
        <div className="max-w-5xl mx-auto relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#0a1929] via-brand to-[#0a1929] px-8 py-14 text-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.18),transparent_50%)]" />
          <div className="relative flex flex-col items-center gap-5">
            <h2 className="text-2xl md:text-3xl font-semibold text-white tracking-tight max-w-md">
              Ready to join thousands of happy customers?
            </h2>
            <Link
              href="/signin"
              className="flex items-center gap-2 bg-white text-[#0a1929] font-semibold text-[14px] px-8 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(255,255,255,0.3)]"
            >
              Start booking
              <ArrowRight
                size={15}
                className="transition-transform duration-300"
              />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
