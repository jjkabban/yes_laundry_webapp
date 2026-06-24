"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import Icon from "../icons/LucideIcons";
import { Logo } from "../ui";
import { useCallback, useState } from "react";

type ActiveTabType =
  | "report"
  | "home"
  | "payment"
  | "workflow"
  | "order"
  | "service"
  | "staff"
  | "setting";
type DashboardTabs = {
  name: ActiveTabType;
  label: string;
  icon: string;
  href: string;
};
type DashboardSectionType = { name: string; group: DashboardTabs[] };
const Sections: DashboardSectionType[] = [
  {
    name: "Main dashboard",
    group: [
      { name: "home", label: "Home", icon: "Home", href: "/admin-home" },
      {
        name: "report",
        label: "Reports & analysis",
        icon: "BarChart3",
        href: "/admin-report",
      },
    ],
  },
  {
    name: "Daily operations",
    group: [
      {
        name: "order",
        label: "Orders",
        icon: "ShoppingBag",
        href: "/admin-orders",
      },
      {
        name: "workflow",
        label: "Work flow",
        icon: "Workflow",
        href: "/admin-workflow",
      },
    ],
  },
  {
    name: "Listings & Payments",
    group: [
      {
        name: "service",
        label: "Services",
        icon: "WashingMachine",
        href: "/admin-home",
      },
      {
        name: "payment",
        label: "Payments",
        icon: "DollarSign",
        href: "/admin-payments",
      },
    ],
  },
  {
    name: "Staff & Settings",
    group: [
      {
        name: "staff",
        label: "Staff management",
        icon: "User",
        href: "/admin-staff",
      },
      {
        name: "setting",
        label: "Settings",
        icon: "Settings",
        href: "/admin-settings",
      },
    ],
  },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0 },
};

type Props = {
  onMenuClose: () => void;
};

export default function AdminSideBar({ onMenuClose }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("home");

  const onTabSelect = useCallback(
    (tab: ActiveTabType) => {
      setActiveTab(tab);
    },
    [activeTab],
  );

  return (
    <div className="fixed inset-0 z-50">
      <motion.div
        className="bg-black/50 backdrop-blur-[2px] flex h-full "
        onClick={onMenuClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
      >
        <motion.div
          className="bg-white px-6 py-6 w-[300] h-full md:w-1/5 relative flex flex-col shadow-2xl shadow-black/20"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 32 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-8 items-center justify-between shrink-0 px-1">
            <Logo height={200} width={200} />
            <motion.button
              whileHover={{ scale: 1.06 }}
              whileTap={{ scale: 0.9 }}
              onClick={onMenuClose}
              className="p-2 bg-gray-100 hover:bg-gray-200 text-paragraph/60 rounded-full cursor-pointer transition-colors"
            >
              <X size={18} />
            </motion.button>
          </div>

          <motion.div
            className="mt-8 flex flex-col overflow-y-scroll px-1 overflow-x-hidden flex-1 min-h-0 w-full
              [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-thumb]:bg-gray-200 [&::-webkit-scrollbar-thumb]:rounded-full"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {Sections.map((sec, index) => (
              <motion.div
                key={sec.name + index}
                variants={itemVariants}
                className={`py-4 ${index !== 0 && "border-t border-paragraph/8 mt-1"}`}
              >
                <h3 className="w-full mb-2 mt-1 px-2 uppercase text-[11px] font-semibold tracking-wider text-paragraph/40">
                  {sec.name}
                </h3>

                <div className="flex flex-col gap-0.5">
                  {sec.group.map((link, index) => {
                    const isActive = link.name === activeTab;
                    return (
                      <Link
                        href={link.href}
                        key={link.name + index}
                        onClick={() => onTabSelect(link.name)}
                        className="relative flex items-center gap-3 py-2.5 px-2 rounded-xl group"
                      >
                        {isActive && (
                          <motion.div
                            layoutId="admin-sidebar-active"
                            className="absolute inset-0 bg-brand/8 rounded-xl"
                            transition={{
                              type: "spring",
                              stiffness: 400,
                              damping: 35,
                            }}
                          />
                        )}
                        <span
                          className={`relative z-10 flex items-center justify-center h-9 w-9 rounded-lg shrink-0 transition-colors ${
                            isActive
                              ? "bg-brand text-white"
                              : "bg-gray-100 text-paragraph/50 group-hover:bg-gray-200"
                          }`}
                        >
                          <Icon
                            name={link.icon as keyof typeof Icon}
                            size={17}
                          />
                        </span>
                        <span
                          className={`relative z-10 text-[14px] transition-colors ${
                            isActive
                              ? "text-brand font-semibold"
                              : "text-paragraph/75 font-medium group-hover:text-paragraph"
                          }`}
                        >
                          {link.label}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
