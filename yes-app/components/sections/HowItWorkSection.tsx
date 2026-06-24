"use client";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import useWindow from "@/hooks/useWindow";
import { useState } from "react";
import { Plus } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Schedule",
    description:
      "Book a laundry pickup through our app or website in just seconds with the 'Book Now' button.",
  },
  {
    number: "02",
    title: "Pickup",
    description: "Our team collects your laundry right from your doorstep.",
  },
  {
    number: "03",
    title: "Professional clean",
    description: "We expertly clean your clothes — delicate fabrics included.",
  },
  {
    number: "04",
    title: "Delivery & Payment",
    description: "Fresh laundry delivered back to you, folded and spotless.",
  },
];

const imageCollage = [
  "/images/work1.jpg",
  "/images/work2.jpg",
  "/images/work3.jpg",
  "/images/work4.jpg",
];

export default function HowItWorksSection() {
  const { isMobile, isTablet } = useWindow();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const isSmallScreen = isMobile || isTablet;

  return (
    <section className="mt-10 px-6 py-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-16">
        {/* Left: slides in from the left */}
        <motion.div
          className="flex flex-col flex-1"
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="text-center mb-6">
            <span className="text-[13px] font-semibold uppercase tracking-[0.25em] text-gold">
              How it works
            </span>
            <h2 className="mt-3 text-3xl md:text-4xl font-semibold text-paragraph tracking-tight">
              Laundry in 4 simple steps
            </h2>
            <p className="mt-3.5 md:text-base text-[#5a6472] leading-relaxed max-w-xl mx-auto">
              Our laundry system is designed for ultimate ease and clarity —
              from booking to delivery, we've made every step effortless.
            </p>
          </div>

          {isSmallScreen ? (
            <div className="flex flex-col divide-y divide-paragraph/8">
              {steps.map((step, index) => {
                const isOpen = openIndex === index;
                return (
                  <div key={step.number}>
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between py-4 text-left"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl font-semibold text-brand tracking-tight w-6">
                          {step.number}
                        </span>
                        <span className=" font-medium font-heading">
                          {step.title}
                        </span>
                      </div>
                      <motion.span
                        animate={{ rotate: isOpen ? 45 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="text-[#b8964e] text-xl leading-none shrink-0 ml-4"
                      >
                        <Plus size={20} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          key="content"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <p className="pb-4 pl-9  text-[#5a6472] leading-relaxed">
                            {step.description}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {steps.map((step) => (
                <div
                  key={step.number}
                  className="flex flex-col gap-3 p-6 rounded-2xl  border border-paragraph/5"
                >
                  <span className="text-3xl font-semibold text-[#b8964e]/30 tracking-tight">
                    {step.number}
                  </span>
                  <h3 className="text-base font-semibold text-paragraph">
                    {step.title}
                  </h3>
                  <p className="text-[13px] text-[#5a6472] leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <p className=" text-paragraph mb-4">
              Enjoy convenience and quality every time with Yes Laundry.
            </p>
            <button className="bg-brand text-white md:m-auto md:w-1/2 font-semibold px-8 py-3.5 rounded-full transition-all duration-300 w-full hover:-translate-y-0.5 mt-3">
              Starting booking
            </button>
          </div>
        </motion.div>

        <motion.div
          className="w-full lg:w-[45%] grid grid-cols-2 gap-2 self-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.15 } },
          }}
        >
          {imageCollage.map((img, index) => (
            <motion.div
              key={img + index}
              className="relative w-full h-[220] xl:h-[300] rounded-xl overflow-hidden"
              variants={{
                hidden: { opacity: 0, scale: 0.8 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: { duration: 0.5, ease: "easeOut" },
                },
              }}
            >
              <Image
                src={img}
                alt={`work-${index}`}
                fill
                className="object-cover"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
