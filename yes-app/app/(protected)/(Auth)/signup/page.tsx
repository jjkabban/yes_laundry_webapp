"use client";
import { Logo } from "@/components/ui";
import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { CheckCircle2, Mail, Phone } from "lucide-react";
import GoogleLogo from "../../../../assets/google_logo.png";
import AppleLogo from "../../../../assets/apple_logo.svg";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { thumbnails } from "@/data/pages/signup";
import { useBookingData } from "@/context/BookingDataContext";

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
  center: { x: 0 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%" }),
};

const CARD_WIDTH = 320;
const GAP = 12;
const PEEK = 32;

export default function SignupPage() {
  const router = useRouter();
  const [[activeIndex, direction], setSlide] = useState<[number, number]>([
    0, 1,
  ]);
  const [activeDot, setActiveDot] = useState<number>(0);
  const { formData, extraInfo } = useBookingData();

  const goTo = (index: number) => {
    setSlide(([prev]) => [index, index > prev ? 1 : -1]);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setSlide(([prev]) => [(prev + 1) % thumbnails.length, 1]);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollToIndex = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const offset = index * (CARD_WIDTH + GAP) - PEEK;
    el.scrollTo({ left: offset, behavior: "smooth" });
    setActiveDot(index);
  };

  useEffect(() => {
    console.log("form data is ", formData, "extra info is", extraInfo);
  }, [formData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveDot((prev) => {
        const next = (prev + 1) % thumbnails.length;
        scrollToIndex(next);
        return next;
      });
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col md:flex-row md:min-h-screen">
      <div className="px-4 pt-5 md:hidden">
        <Logo height={200} width={200} />
      </div>

      <div className="flex flex-col md:flex-row w-full md:min-h-screen">
        {/* Desktop single-image carousel */}
        <div className="hidden md:block md:w-1/2 md:relative md:overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={thumbnails[activeIndex].image}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="absolute inset-0"
            >
              <Image
                src={thumbnails[activeIndex].image}
                fill
                alt={thumbnails[activeIndex].descriptions}
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute z-20 bottom-12 left-8 right-8">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.25, duration: 0.5 }}
                  className="text-white text-3xl font-semibold leading-snug block max-w-md"
                >
                  {thumbnails[activeIndex].descriptions}
                </motion.span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="absolute z-30 bottom-6 left-8 flex gap-2">
            {thumbnails.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "w-8 bg-white" : "w-1.5 bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Mobile thumbnail*/}
        <div
          ref={scrollerRef}
          className="flex md:hidden mt-10 md:mt-10 flex-row gap-3 pl-8 w-full overflow-x-auto snap-x snap-mandatory scroll-smooth [&::-webkit-scrollbar]:hidden"
        >
          {thumbnails.map((img, i) => (
            <div
              key={img.image + i}
              className="h-[230] w-[320] md:w-11/12 md:h-[380] shrink-0 relative overflow-hidden rounded-2xl snap-center"
            >
              <Image
                src={img.image}
                fill
                alt={img.descriptions}
                className="object-cover"
              />
              <div className="absolute z-20 bottom-0 left-0 right-0 px-4 py-3 bg-linear-to-t from-black/90 to-transparent">
                <span className="text-white text-[18px] font-semibold">
                  {img.descriptions}
                </span>
              </div>
            </div>
          ))}

          <div className="shrink-0 w-8" />
        </div>

        {/* Form */}
        <div className="md:w-3/5 flex flex-col justify-center relative">
          <div className="md:w-full absolute hidden md:flex top-6  z-30 left-0 right-0  items-center justify-center">
            <div className="md:hidden xl:block">
              <Logo height={200} width={200} />
            </div>
          </div>

          <div className="flex flex-col items-center justify-center">
            <h3 className="text-center text-[22px] font-semibold px-4 mt-6 md:mt-0 md:w-1/2 ">
              Get in quickly lets make your life simpler and clothes cleaner
            </h3>

            {formData && (
              <div className="flex items-center gap-2 mx-auto mt-4 w-fit rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2">
                <CheckCircle2 size={14} className="text-emerald-600 shrink-0" />
                <span className="text-[12.5px] font-medium text-emerald-700">
                  {extraInfo}
                </span>
              </div>
            )}
          </div>

          <div className="flex flex-col mx-5 mt-8 md:max-w-sm md:mx-auto md:w-full">
            <motion.button
              onClick={() => router.push("/signup/signup-form?type=phone")}
              whileTap={{ opacity: 0.9 }}
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              className="bg-brand rounded-xl cursor-pointer flex flex-row text-white font-medium items-center justify-center py-4 gap-2"
            >
              <Phone size={20} />
              <span>Continue with phone</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              onClick={() => {
                router.push("/signup/signup-form?type=email");
              }}
              className="border-brand border-[1] mt-4 cursor-pointer rounded-xl flex flex-row text-black font-medium items-center justify-center py-4 gap-2"
            >
              <Mail size={20} />
              <span>Continue with email</span>
            </motion.button>

            <motion.button
              onClick={() => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
              }}
              whileHover={{ scale: 1.02, opacity: 0.9 }}
              className="border-brand border-[1] cursor-pointer mt-4 rounded-xl flex flex-row text-black font-medium items-center justify-center py-3 gap-2"
            >
              <div className="relative h-[25] w-[25]">
                <Image src={GoogleLogo} fill alt="google_logo" />
              </div>
              <span>Continue with Google</span>
            </motion.button>

            {/* <motion.button className="border-brand border-[1] mt-4 rounded-xl flex flex-row text-black font-medium items-center justify-center py-4 gap-2">
              <div className="relative h-[20] w-[20] self-start">
                <Image src={AppleLogo} fill alt="apple_logo" />
              </div>
              <span>Continue with Apple</span>
            </motion.button> */}

            <div className="flex flex-col items-center py-3">
              <h5 className="text-paragraph">Already have an account?</h5>
              <Link
                href={"/signin"}
                className="text-[18px] font-semibold text-brand"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
