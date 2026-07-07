"use client";
import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import Icon from "../icons/LucideIcons";
import { usePathname, useRouter } from "next/navigation";
import useActiveTab, { ActiveTabType } from "@/hooks/useActiveTab";

const Tabs: { name: ActiveTabType; label: string; icon: string }[] = [
  { name: "home", label: "Home", icon: "Home" },
  { name: "orders", label: "Orders", icon: "ShoppingBag" },
  { name: "profile", label: "Profile", icon: "UserCircle" },
];

const getFirstChar = (firstname: string, lastname: string) => {
  const charA = firstname[0];
  const charB = lastname[0];

  return charA + charB;
};

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return `Good morning`;
  if (hour < 17) return `Good afternoon`;
  if (hour < 21) return `Good evening`;
  return `Good night`;
}

export default function CustomerTabs() {
  const [activeTab, setActiveTab] = useState<ActiveTabType>("home");
  const pathName = usePathname();
  const onTabSelect = useCallback(
    (tab: ActiveTabType) => {
      setActiveTab(tab);
      switch (tab) {
        case "home":
          router.push("/user-home");
          break;
        case "orders":
          router.push("/user-orders");
          break;
        case "profile":
          router.push("/user-profile");
          break;
        default:
          router.push("/user-home");
      }
    },
    [activeTab],
  );

  useEffect(() => {
    if (pathName.startsWith("/user-orders")) {
      setActiveTab("orders");
    } else if (pathName.startsWith("/user-home")) {
      setActiveTab("home");
    } else if (pathName.startsWith("/user-profile")) {
      setActiveTab("profile");
    } else {
      setActiveTab("home");
    }
  }, [pathName]);
  const router = useRouter();
  const { user } = useAuth();
  return (
    <div className="fixed bottom-0 left-0 right-0 w-full z-50 backdrop-blur-xl bg-white/50 border-t border-gray-200">
      <div className="flex flex-row items-center justify-between px-2 pt-3 pb-4">
        {Tabs.map((tab, index) => (
          <button
            key={tab.name + index}
            className="flex-1 flex flex-col items-center justify-center"
            onClick={() => onTabSelect(tab.name)}
          >
            <Icon
              name={tab.icon as keyof typeof Icon}
              color={activeTab === tab.name ? "#004a94" : "#666"}
              size={24}
              strokeWidth={activeTab === tab.name ? 2.8 : 1.8}
            />
            <span className="text-xs text-gray-500 mt-1">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
