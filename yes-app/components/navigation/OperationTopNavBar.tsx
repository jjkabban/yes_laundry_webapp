"use client";
import { Home, Menu, MoreHorizontal, MoreVertical } from "lucide-react";
import Icon from "../icons/LucideIcons";
import { useCallback, useState } from "react";
import { AdminSideBar, StaffSideBar } from "../layout";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import { Logo } from "../ui";
import { useAuth } from "@/context/AuthContext";
import useWindow from "@/hooks/useWindow";

type TabType = "dashboard" | "order" | "service" | "customer" | "home";
type LinkType = { name: TabType; href: string; icon: string; label: string };

const menus: LinkType[] = [
  {
    name: "dashboard",
    label: "Dashboard",
    href: "/admin-home",
    icon: "LayoutDashboard",
  },
  {
    name: "order",
    label: "Orders",
    href: "/admin-orders",
    icon: "ShoppingBag",
  },
  {
    name: "service",
    href: "/admin-services",
    label: "Services",
    icon: "WashingMachine",
  },
];

const previewSites: LinkType[] = [
  {
    name: "customer",
    label: "Customer",
    href: "/user-home",
    icon: "UserCircle",
  },
  {
    name: "home",
    label: "Home",
    href: "/",
    icon: "Home",
  },
];

export default function OperationTopNavBar() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [openDropDown, setOpenDropDown] = useState(false);
  const { user } = useAuth();
  const { isDesktop } = useWindow();

  const onTabSelect = useCallback(
    (tab: TabType) => {
      setActiveTab(tab);
    },
    [activeTab],
  );

  const onCloseMenu = useCallback(() => {
    setOpenMenu(false);
  }, [openMenu]);

  return (
    <div className="border-b-[1] border-b-paragraph/10 pb-3">
      <div className="flex justify-between px-5 xl:px-8 md:px-6 py-4 items-center">
        <div>
          <div className="flex gap-3 items-center">
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              className="cursor-pointer"
              onClick={() => {
                setOpenMenu(true);
              }}
            >
              <Menu />
            </motion.button>
            {!isDesktop && (
              <h3 className="font-medium text-[18px]">
                {user?.role === "Admin"
                  ? "Admin Dashboard"
                  : user?.role === "Staff"
                    ? "Staff Dashboard"
                    : null}
              </h3>
            )}
          </div>
          <AnimatePresence>
            {openMenu &&
              (user?.role === "Admin" ? (
                <AdminSideBar onMenuClose={onCloseMenu} />
              ) : user?.role === "Staff" ? (
                <StaffSideBar onMenuClose={onCloseMenu} />
              ) : null)}
          </AnimatePresence>
        </div>

        {isDesktop && (
          <h3 className="font-medium text-[18px]">
            {user?.role === "Admin"
              ? "Admin Dashboard"
              : user?.role === "Staff"
                ? "Staff Dashboard"
                : null}
          </h3>
        )}

        <div className="flex items-center gap-6">
          <div className="relative">
            <motion.button
              whileTap={{ scale: 0.92 }}
              className={`p-2 rounded-full border transition-colors cursor-pointer ${
                openDropDown
                  ? "bg-brand/10 border-brand/30 text-brand"
                  : "bg-gray-100 border-transparent text-paragraph/70 hover:bg-gray-200"
              }`}
              onClick={() => setOpenDropDown(!openDropDown)}
            >
              <MoreHorizontal size={18} />
            </motion.button>

            <AnimatePresence>
              {openDropDown && (
                <>
                  {/* click-away catcher */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setOpenDropDown(false)}
                  />

                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.96 }}
                    transition={{ duration: 0.16, ease: "easeOut" }}
                    className="absolute z-20 right-0 top-[calc(100%+10px)] min-w-[220px] origin-top-right
                      bg-white border border-paragraph/10 rounded-2xl shadow-xl shadow-black/5 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-paragraph/10 bg-gray-50">
                      <h3 className="font-semibold text-[13px] tracking-wide text-paragraph/60 uppercase">
                        Preview Sites
                      </h3>
                    </div>

                    <div className="flex flex-col p-1.5">
                      {previewSites.map((site) => (
                        <Link
                          href={site.href}
                          key={site.name}
                          onClick={() => setOpenDropDown(false)}
                          className="group flex items-center gap-3 px-2.5 py-2.5 rounded-xl
                            hover:bg-brand/5 transition-colors"
                        >
                          <span
                            className="flex items-center justify-center h-8 w-8 rounded-lg
                              bg-gray-100 text-paragraph/60 group-hover:bg-brand group-hover:text-white
                              transition-colors"
                          >
                            <Icon
                              name={site.icon as keyof typeof Icon}
                              size={15}
                            />
                          </span>
                          <span className="text-[14px] font-medium text-paragraph/80 group-hover:text-brand transition-colors">
                            {site.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          <button className="h-8 w-8 rounded-full bg-brand text-white text-[13px] font-semibold flex items-center justify-center">
            <span>AJ</span>
          </button>
        </div>
      </div>

      <div className="mt-3">
        <div className="px-3 flex gap-3 flex-row items-center">
          {menus.map((menu, id) => {
            const isActive = menu.name === activeTab;

            return (
              <button
                onClick={() => onTabSelect(menu.name)}
                key={id + menu.name}
                className={`flex cursor-pointer gap-2 items-center justify-center border-[1px] px-4 py-2 rounded-md transition-colors ${
                  isActive
                    ? "bg-brand border-brand"
                    : "border-paragraph/30 hover:bg-foreground"
                }`}
              >
                <Icon
                  name={menu.icon as keyof typeof Icon}
                  size={16}
                  color={isActive ? "#fff" : "#888"}
                />
                <span
                  className={`text-[14px] xl:text-sm
                    ${isActive ? "text-white font-medium" : "text-paragraph/70"}
                  `}
                >
                  {menu.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
