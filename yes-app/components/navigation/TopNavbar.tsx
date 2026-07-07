"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "../ui/Logo";
import { motion, AnimatePresence } from "motion/react";
import { Variants } from "motion/react";
import {
  Menu,
  X,
  Sparkles,
  CalendarCheck,
  Info,
  ArrowRight,
  Phone,
  Home,
} from "lucide-react";
import Icon from "../icons/LucideIcons";
import useWindow from "@/hooks/useWindow";

const NavLinks = [
  { name: "Home", href: "/", icon: Home },
  { name: "Services", href: "/services", icon: Sparkles },
  { name: "How it works", href: "/how-it-works", icon: Info },
  { name: "Schedule a pickup", href: "/schedule", icon: CalendarCheck },
];

const listVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.25, ease: "easeOut" as const },
  },
};

type Props = { className?: string };

export default function TopNavbar({ className }: Props) {
  const [openMenu, setOpenMenu] = useState(false);
  const pathname = usePathname();
  const { isMobile, isTablet, isDesktop } = useWindow();

  return (
    <div className="md:h-auto">
      <header
        className={`fixed top-0 left-0 right-0 z-20 h-[64] flex items-center justify-between px-6 xl:px-10 ${className ?? ""}`}
      >
        <div className="absolute inset-0 -z-10 bg-white/95 backdrop-blur-md border-b border-black/6" />

        <Logo height={20} width={230} />

        <nav className=" items-center gap-1 hidden md:flex">
          {NavLinks.map((link) => {
            const active = pathname === link.href;
            if (link.name === "Home") return;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-sm font-medium transition-colors ${
                  active
                    ? "bg-black/6 text-black"
                    : "text-black/60 hover:text-black hover:bg-black/4"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* desktop CTAs */}

        <div className="hidden items-center gap-2 md:flex">
          <Link
            href="/contact"
            className="flex items-center gap-1.5 text-sm font-medium text-black/60 hover:text-black transition-colors px-2"
          >
            <Icon name="Phone" size={16} />
            Contact
          </Link>
          <Link
            href="/signin"
            className="text-sm font-medium text-black px-4 py-2 rounded-full border border-black/12 hover:bg-black/4 transition-colors"
          >
            Log in
          </Link>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/signup"
              className="flex items-center gap-1.5 bg-brand text-white text-sm font-medium px-4 py-2.5 rounded-full hover:bg-black/85 transition-colors"
            >
              Signup
            </Link>
          </motion.div>
        </div>

        {/* mobile / tablet hamburger */}

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setOpenMenu(true)}
          className="md:hidden  p-2 pr-1 rounded-lg hover:bg-black/5 transition-colors"
          aria-label="Open menu"
        >
          <Menu size={22} strokeWidth={2.2} className="text-black" />
        </motion.button>
      </header>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            className="md:hidden fixed inset-0 z-50 0 h-screen bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setOpenMenu(false)}
          >
            <motion.div
              className="absolute inset-y-0 h-full overflow-hidden left-0 w-72 max-w-[85vw] bg-white flex flex-col"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* drawer header */}
              <div className="flex items-center justify-between px-5 h-16 border-b border-black/6 shrink-0">
                <div
                  onClick={() => {
                    setOpenMenu(false);
                  }}
                >
                  <Logo height={180} width={180} />
                </div>

                <motion.button
                  onClick={() => setOpenMenu(false)}
                  className="p-1.5 rounded-full hover:bg-black/6 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} strokeWidth={2.2} />
                </motion.button>
              </div>

              {/* nav links */}
              <motion.div
                className="flex flex-col gap-1 px-4 pt-6"
                variants={listVariants}
                initial="hidden"
                animate="visible"
              >
                {NavLinks.map((link, idx) => {
                  const active = pathname === link.href;
                  return (
                    <motion.div key={link.name} variants={itemVariants}>
                      <Link
                        href={link.href}
                        onClick={() => setOpenMenu(false)}
                        className={`flex items-center ${NavLinks.length - 1 !== idx && "border-b-[1] border-b-brand/20"}  gap-3 px-3 py-5 rounded-xl transition-colors ${
                          active
                            ? "bg-black/6 text-black"
                            : "text-black/70 hover:bg-black/4 hover:text-black"
                        }`}
                      >
                        <span
                          className={`rounded-lg flex items-center justify-center shrink-0 ${
                            active ? "bg-black text-white" : " text-black/60"
                          }`}
                        >
                          <link.icon size={15} strokeWidth={2} />
                        </span>
                        <span className="text-[16px] font-medium">
                          {link.name}
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}

                <div className="mt-2 pt-4 border-t border-black/6">
                  <Link
                    href="/contact"
                    onClick={() => setOpenMenu(false)}
                    className="flex items-center gap-3 px-3 py-3.5 rounded-xl text-black/60 hover:bg-black/4 hover:text-black transition-colors"
                  >
                    <span className="rounded-lg flex items-center justify-center shrink-0">
                      <Phone
                        size={15}
                        strokeWidth={2}
                        className="text-black/60"
                      />
                    </span>
                    <span className="text-[16px] font-medium">Contact us</span>
                  </Link>
                </div>
              </motion.div>

              {/* buttons — you handle positioning */}
              <div className="px-4 py-6 mt-10 flex flex-col gap-2.5">
                <Link
                  href="/signup"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center justify-center gap-2 bg-brand text-white text-sm font-medium py-3.5 rounded-xl transition-colors"
                >
                  Sign up
                </Link>
                <Link
                  href="/signin"
                  onClick={() => setOpenMenu(false)}
                  className="flex items-center justify-center text-sm font-medium py-3.5 rounded-xl border border-black/12 text-black hover:bg-black/4 transition-colors"
                >
                  Log in
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
