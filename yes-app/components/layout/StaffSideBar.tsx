"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Link from "next/link";
import Icon from "../icons/LucideIcons";
import { Logo } from "../ui";
import { useCallback, useState } from "react";

type ActiveTabType = "home" | "workflow" | "order" | "setting";
type DashboardTabs = {
  name: ActiveTabType;
  label: string;
  icon: string;
  href: string;
};

const menuItems: DashboardTabs[] = [
  { name: "home", label: "Dashboard", icon: "Home", href: "/staff-home" },
  {
    name: "order",
    label: "Orders",
    icon: "ShoppingBag",
    href: "/staff-orders",
  },
  {
    name: "workflow",
    label: "Work flow",
    icon: "Workflow",
    href: "/staff-workflow",
  },
  {
    name: "setting",
    label: "Settings",
    icon: "Settings",
    href: "/staff-settings",
  },
];

const listVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

type Props = {
  onMenuClose: () => void;
};

export default function StaffSideBar({ onMenuClose }: Props) {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("home");

  const onTabSelect = useCallback(
    (tab: ActiveTabType) => {
      setActiveTab(tab);
    },
    [activeTab],
  );
  return (
    <div className="min-h-screen fixed inset-0 z-50">
      <motion.div
        className=" bg-black/60 flex h-full"
        onClick={onMenuClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
      >
        <motion.div
          className="bg-white px-8 py-5 w-3/4 md:w-1/5 h-full relative flex flex-col"
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex gap-8 items-center justify-between shrink-0">
            <Logo height={200} width={200} />
            <motion.button
              onClick={onMenuClose}
              className="p-1 bg-white rounded-full cursor-pointer"
            >
              <X size={20} />
            </motion.button>
          </div>
          <motion.div
            className="mt-10 flex flex-col flex-1 min-h-0 w-full"
            variants={listVariants}
            initial="hidden"
            animate="visible"
          >
            {menuItems.map((link, index) => {
              const isActive = link.name === activeTab;
              return (
                <motion.div
                  key={link.name + index}
                  variants={itemVariants}
                  className="border-b-2 py-4 border-b-paragraph/10"
                >
                  <Link
                    href={link.href}
                    onClick={() => onTabSelect(link.name)}
                    className={`flex items-center gap-2 border-b-2 border-transparent hover:bg-foreground py-3 w-full rounded-xl px-2 ${
                      isActive && "bg-brand/10"
                    }`}
                  >
                    <Icon
                      name={link.icon as keyof typeof Icon}
                      size={20}
                      color="#444"
                    />
                    <span className="text-sm text-paragraph/90">
                      {link.label}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
