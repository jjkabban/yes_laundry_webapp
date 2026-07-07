"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

type AnimDir = "top-down" | "bottom-up" | "left-right" | "right-left";

interface HeroSlide {
  eyebrow: string;
  title: string;
  titleImage?: string;
  description: string;
  button: string;
  image: string;
  buttonAnimDir: AnimDir;
  titleAnimDir: AnimDir;
}

const heroDescription: HeroSlide[] = [
  {
    eyebrow: "Premium laundry, redefined",
    title: "Welcome to Yes Laundry",
    // titleImage: "/images/slider-logo.png",
    description:
      "Next-level laundry. Effortless, sparkling results. Premium care for every fabric, delivered to your door.",
    button: "Book now",
    image: "/images/wash.jpg",
    buttonAnimDir: "bottom-up",
    titleAnimDir: "top-down",
  },
  {
    eyebrow: "Zero hassle, all comfort",
    title: "Pickup & delivery, your way",
    description:
      "Choose a pickup time that fits your schedule — morning, evening, or weekend. We'll come to you.",
    button: "Schedule a pickup",
    image: "/images/wash2.jpg",
    buttonAnimDir: "right-left",
    titleAnimDir: "left-right",
  },
  {
    eyebrow: "Reliability you can count on",
    title: "Always on time, Any time",
    description:
      "Track your order in real time and get your clothes back when we say we will, guaranteed.",
    button: "See how it works",
    image: "/images/wash1.jpg",
    buttonAnimDir: "left-right",
    titleAnimDir: "right-left",
  },
  {
    eyebrow: "Expert handling, every time",
    title: "Care for every fabric we handle",
    description:
      "From everyday cottons to delicate silks and suits, our team treats every item with expert care.",
    button: "View services",
    image: "/images/wash2.jpg",
    buttonAnimDir: "top-down",
    titleAnimDir: "bottom-up",
  },
  {
    eyebrow: "Clean clothes, clear conscience",
    title: "Eco-Friendly Cleaning Experts",
    description:
      "Gentle on your clothes, gentle on the planet — we use biodegradable, skin-safe detergents.",
    button: "Book now",
    image: "/images/wash3.jpg",
    buttonAnimDir: "left-right",
    titleAnimDir: "left-right",
  },
];

const titleVariants: Record<
  AnimDir,
  {
    hidden: { opacity: number; y?: number; x?: number };
    visible: { opacity: number; y?: number; x?: number };
  }
> = {
  "top-down": {
    hidden: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
  },
  "bottom-up": {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  },
  "left-right": {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0 },
  },
  "right-left": {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0 },
  },
};

const SLIDE_DURATION = 8000;
type Props = {
  scrollPosition: number;
};

export default function HeroSection({ scrollPosition }: Props) {
  const [index, setIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % heroDescription.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, []);

  const current = heroDescription[index];

  return (
    <div
      className={`relative pt-10  md:pt-20 w-full h-screen md:h-[500] xl:h-[600] overflow-hidden`}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={current.image}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1 }}
          animate={{ opacity: 1, scale: 1.1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 1.2, ease: "easeInOut" },
            scale: { duration: SLIDE_DURATION / 1000, ease: "linear" },
          }}
        >
          <Image
            src={current.image}
            alt={current.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-black/40 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 pb-14 w-full text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col items-center gap-1.5 sm:gap-2.5 w-full"
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.25em" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[13px] text-center md:text-xs font-bold uppercase tracking-[0.25em] text-amber-300/90"
            >
              {current.eyebrow}
            </motion.span>

            <motion.div
              variants={titleVariants[current.titleAnimDir]}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col md:flex-row items-center justify-center gap-3"
            >
              <h1 className="text-4xl md:text-5xl font-semibold text-center tracking-tight text-white leading-[1.1]">
                {current.title}
              </h1>
              {current.titleImage && (
                <Image
                  src={current.titleImage}
                  alt="logo"
                  width={120}
                  height={120}
                  className="object-contain w-20 h-20 md:w-28 md:h-28"
                />
              )}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: 0.15, ease: "easeOut" }}
              className="text-[16px]  md:text-base pt-3 sm:pt-6 text-center mx-auto text-white/90 max-w-md leading-relaxed font-semibold line-clamp-2"
            >
              {current.description}
            </motion.p>
          </motion.div>
        </AnimatePresence>

        <motion.button
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "auto", opacity: 1 }}
          transition={{
            width: { duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.3 },
            opacity: { duration: 0.4, delay: 0.3 },
          }}
          whileTap={{ scale: 1.04 }}
          whileHover={{ scale: 1.03 }}
          onClick={() => router.push("/signup")}
          className="cursor-pointer  md:static absolute bottom-50 mt-10 sm:mt-8 bg-white/70 backdrop-blur-md rounded-full items-center w-[min(94vw,35rem)] sm:min-w[460] sm:min-w-[450] flex flex-row justify-between gap-6 sm:gap-6 px-8 py-4 overflow-hidden"
        >
          <div className="flex flex-col px-2 sm:px-3 items-center sm:items-start text-center sm:text-left">
            <span className="font-semibold text-black text-[14px] sm:text-sm whitespace-nowrap">
              Pick up
            </span>
            <span className="text-black/60 text-[12px] sm:text-sm whitespace-nowrap">
              Add location
            </span>
          </div>
          <div className="h-8 sm:h-full w-[1] bg-gray-400 shrink-0" />
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="font-semibold text-black text-[14px] sm:text-sm whitespace-nowrap">
              Where
            </span>
            <span className="text-black/60 text-[12px] sm:text-sm whitespace-nowrap">
              Add address
            </span>
          </div>

          <div className="bg-brand items-center flex p-2 rounded-full shrink-0">
            <ArrowRight size={16} className="text-white" />
          </div>
        </motion.button>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-10 flex gap-2 items-center justify-center max-w-full">
        {heroDescription.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-10 bg-white" : "w-5 bg-white/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
