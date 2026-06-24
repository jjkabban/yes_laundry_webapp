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
      className={`relative pt-20 w-full h-[500] xl:h-[600]  overflow-hidden `}
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

      <div className="relative z-10 h-full  flex flex-col items-center justify-center px-6 md:px-12 lg:px-20 w-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current.title}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="flex flex-col gap-2.5"
          >
            <motion.span
              initial={{ opacity: 0, letterSpacing: "0.1em" }}
              animate={{ opacity: 1, letterSpacing: "0.25em" }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="text-[11px] text-center md:text-xs font-bold uppercase tracking-[0.25em] text-amber-300/90"
            >
              {current.eyebrow}
            </motion.span>

            <motion.div
              variants={titleVariants[current.titleAnimDir]}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center justify-center gap-3"
            >
              <h1 className="text-3xl md:text-5xl font-semibold text-center tracking-tight text-white leading-[1.1]">
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
              className="text-sm md:text-base pt-6 text-center flex justify-center items-center self-center text-white/90 max-w-md leading-relaxed font-medium line-clamp-2"
            >
              {current.description}
            </motion.p>

            <motion.button
              onClick={() => router.push("/signup")}
              className="absolute bottom-12 mt-8 bg-[white]/70 backdrop-blur-md self-center rounded-full items-center max-w-fit flex flex-row gap-5 px-2  py-2"
            >
              <div className="flex flex-col px-3">
                <span className="font-semibold text-black text-sm">
                  Pick up
                </span>
                <span className="text-black/60  text-sm ">Add location</span>
              </div>
              <div className="h-full w-[0.1] bg-gray-400" />
              <div className="flex flex-col">
                <span className="font-semibold text-black text-sm">Where</span>
                <span className="text-black/60 text-sm ">Add address</span>
              </div>

              <div className="bg-brand h-full items-center flex p-2 rounded-full">
                <ArrowRight className="text-white" />
              </div>
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="absolute bottom-5   left-0 right-0 z-10 flex gap-2 items-center justify-center max-w-full">
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
