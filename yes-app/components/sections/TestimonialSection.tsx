"use client";
import { motion, useInView, type Variants } from "motion/react";
import { useRef, useState, useEffect, useCallback } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

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
  return (
    <div
      className={`flex flex-col gap-4 p-6 rounded-2xl bg-white border border-paragraph/20 shadow-2xs shrink-0 snap-start transition-all duration-300 w-[78vw] sm:w-80 md:w-96 ${
        isActive ? "opacity-100" : "opacity-50"
      }`}
    >
      <div className="flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => (
          <Star key={i} size={14} className="text-[#0d6efd] fill-[#0d6efd]" />
        ))}
      </div>
      <p className="text-[13px] text-[#5a6472] leading-relaxed flex-1">
        &quot;{t.quote}&quot;
      </p>
      <div className="flex items-center gap-3 pt-2 border-t border-[#0a1929]/6">
        <div className="h-9 w-9 rounded-full bg-[#0a1929] flex items-center justify-center shrink-0">
          <span className="text-[11px] font-semibold text-white">
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
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="mb-12 text-center px-6"
          variants={headerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-gold">
            What customers say
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-paragraph tracking-tight">
            Thousands trust Yes Laundry
          </h2>
          <p className="mt-3.5 text-sm md:text-base text-[#5a6472] max-w-xl mx-auto leading-relaxed">
            Real customers, real pickups, real results.
          </p>
        </motion.div>

        {/* overflow-hidden on the wrapper clips the scroll track */}
        <div className="overflow-hidden">
          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto snap-x snap-mandatory scroll-smooth px-6 [&::-webkit-scrollbar]:hidden"
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

        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            disabled={activeIndex === 0}
            aria-label="Previous testimonial"
            className="h-9 w-9 rounded-full border border-[#0a1929]/15 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f8f7f4] transition-colors"
          >
            <ChevronLeft size={16} className="text-[#0a1929]" />
          </button>
          <span className="text-[12px] text-[#5a6472] font-medium tabular-nums">
            {activeIndex + 1} / {testimonials.length}
          </span>
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            disabled={activeIndex === testimonials.length - 1}
            aria-label="Next testimonial"
            className="h-9 w-9 rounded-full border border-[#0a1929]/15 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#f8f7f4] transition-colors"
          >
            <ChevronRight size={16} className="text-[#0a1929]" />
          </button>
        </div>
      </div>
    </section>
  );
}
