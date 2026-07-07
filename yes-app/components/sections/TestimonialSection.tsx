"use client";
import { motion, useInView, type Variants } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useRouter } from "next/navigation";

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
];

const headerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 1, ease: "easeOut" } },
};

function TestimonialCard({
  t,
  isActive,
}: {
  t: (typeof testimonials)[0];
  isActive: boolean;
}) {
  const router = useRouter();
  return (
    <div
      onClick={() => {
        router.push("testimonials");
      }}
      className={`relative flex flex-col gap-4 p-7 rounded-[1.5rem] bg-white shrink-0 snap-start overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] w-[80vw] sm:w-80 md:w-96 ${
        isActive
          ? "opacity-100 scale-100 shadow-[0_20px_45px_-15px_rgba(0,74,148,0.18)] ring-1 ring-brand/25"
          : "opacity-50 scale-[0.96] shadow-[0_8px_20px_-10px_rgba(0,74,148,0.1)] ring-1 ring-[#0a1929]/8"
      }`}
    >
      <Quote
        size={72}
        strokeWidth={0}
        className="absolute -top-2 -right-2 text-brand/10 fill-brand/10 pointer-events-none"
      />

      <div className="relative flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star
            key={i}
            size={14}
            className="text-emerald-600 fill-emerald-600"
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
    </div>
  );
}

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollToIndex = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(testimonials.length - 1, index));
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const card = scroller.children[clamped] as HTMLElement | undefined;
    if (!card) return;
    scroller.scrollTo({ left: card.offsetLeft - 24, behavior: "smooth" });
    setActiveIndex(clamped);
  }, []);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    let frame: number;
    const handleScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const center = scroller.scrollLeft + scroller.clientWidth / 2;
        let closest = 0;
        let closestDist = Infinity;
        Array.from(scroller.children).forEach((child, i) => {
          const el = child as HTMLElement;
          const elCenter = el.offsetLeft + el.clientWidth / 2;
          const dist = Math.abs(center - elCenter);
          if (dist < closestDist) {
            closestDist = dist;
            closest = i;
          }
        });
        setActiveIndex(closest);
      });
    };
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      scroller.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={ref}
      className="py-20 md:py-28 bg-linear-to-b from-white to-brand/10 relative overflow-hidden"
    >
      {/* two-tone ambient glow: brand blue balanced with a hint of green */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand/8 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/8 rounded-full blur-3xl -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <div className="max-w-7xl mx-auto relative">
        <motion.div
          className="mb-14 text-center px-6"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="text-[13px] font-bold uppercase tracking-[0.25em] text-brand">
            What customers say
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-paragraph tracking-tight">
            Thousands trust Yes Laundry
          </h2>
          <p className="mt-3.5 text-sm md:text-base text-[#5a6472] max-w-xl mx-auto leading-relaxed">
            Real customers, real pickups, real results.
          </p>
        </motion.div>

        {/* overflow-hidden on the wrapper clips the scroll track; mask fades the edges */}
        <div
          className="overflow-hidden"
          style={{
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
            maskImage:
              "linear-gradient(to right, transparent, black 4%, black 96%, transparent)",
          }}
        >
          <div
            ref={scrollerRef}
            className="flex gap-2 ml-8 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 py-2 [&::-webkit-scrollbar]:hidden"
            style={{ scrollbarWidth: "none" }}
          >
            {testimonials.map((t, i) => (
              <TestimonialCard
                key={t.name}
                t={t}
                isActive={i === activeIndex}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-center items-center gap-5 mt-10">
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous testimonial"
            className="h-10 w-10 rounded-full border border-[#0a1929]/15 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:border-brand/40 hover:shadow-sm transition-all"
          >
            <ChevronLeft size={16} className="text-[#0a1929]" />
          </button>

          <div className="flex items-center gap-2">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                className={`h-1.5 rounded-full transition-all duration-400 ${
                  i === activeIndex
                    ? "w-6 bg-brand"
                    : "w-1.5 bg-[#0a1929]/15 hover:bg-[#0a1929]/25"
                }`}
              />
            ))}
          </div>

          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === testimonials.length - 1}
            aria-label="Next testimonial"
            className="h-10 w-10 rounded-full border border-[#0a1929]/15 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white hover:border-brand/40 hover:shadow-sm transition-all"
          >
            <ChevronRight size={16} className="text-[#0a1929]" />
          </button>
        </div>
      </div>
    </section>
  );
}
