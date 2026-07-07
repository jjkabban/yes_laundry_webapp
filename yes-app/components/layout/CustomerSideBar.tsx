"use client";
import Image from "next/image";
import Icon from "../icons/LucideIcons";
import {
  Dispatch,
  useCallback,
  useEffect,
  useState,
  SetStateAction,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { usePanel } from "@/context/DashboardContext";
import useActiveTab from "@/hooks/useActiveTab";
import { ActiveTabType } from "@/hooks/useActiveTab";

const Tabs: { name: ActiveTabType; label: string; icon: string }[] = [
  { name: "home", label: "Home", icon: "Home" },
  { name: "orders", label: "Orders", icon: "ShoppingBag" },
  { name: "profile", label: "Profile", icon: "UserCircle" },
];
type SliderContentType = "messages" | "notifications";
type Props = {};

export default function CustomerSideBar({}: Props) {
  const router = useRouter();
  const pathName = usePathname();
  const { onPanelSelect } = usePanel();
  const { activeTab, onTabChange } = useActiveTab();

  useEffect(() => {
    const tab = pathName.split("-")[1];
    onTabChange(tab as ActiveTabType);
  }, [pathName]);

  const onTabSelect = useCallback(
    (tab: ActiveTabType) => {
      onTabChange(tab);
      switch (tab) {
        case "home":
          router.push("/user-home");
          break;
        case "logo":
          router.push("/user-home");
          break;
        case "orders":
          onPanelSelect("orders");
          break;
        case "logout":
          router.push("/user-settings");
          break;
        case "profile":
          onPanelSelect("profile");
          break;
        default:
      }
    },
    [activeTab],
  );
  return (
    <div className="fixed top-0 left-0 h-screen w-16 bg-white border-r border-r-black/10 z-30">
      <div className="flex flex-col h-full items-center justify-between px-2 pt-3 pb-3">
        <button onClick={() => onTabSelect("logo")}>
          <Image
            src={"/images/logo_icon.png"}
            alt="logo_icon"
            height={40}
            width={40}
          />
        </button>

        <div className="flex-col gap-6 flex justify-between xl:-mt-80">
          {Tabs.map((tab, index) => (
            <button
              key={tab.name + index}
              className="flex flex-col md:py-4  items-center justify-center cursor-pointer hover:bg-foreground p-1 rounded-md"
              onClick={() => {
                onTabSelect(tab.name);
              }}
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

        <div>
          <button
            className=" hover:bg-foreground p-2 cursor-pointer rounded-md"
            onClick={() => {
              onTabSelect("logout");
            }}
          >
            <Icon
              name={"LogOut"}
              color={activeTab === "logout" ? "#004a94" : "#666"}
              size={24}
              strokeWidth={activeTab === "logout" ? 2.8 : 1.8}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
