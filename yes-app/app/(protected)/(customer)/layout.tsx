"use client";
import { CustomerSideBar, CustomerTabs } from "@/components/layout";
import useWindow from "@/hooks/useWindow";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePanel } from "@/context/DashboardContext";
import {
  MessageScreen,
  NotificationScreen,
  OrderScreen,
} from "@/components/screens";

type SliderContentType = "messages" | "notifications";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isMobile, isTablet } = useWindow();
  const isSmallerScreen = isTablet || isMobile;
  const { panel, openPanel } = usePanel();

  return (
    <div className="bg-foreground">
      {isSmallerScreen ? (
        <main>
          <CustomerTabs />
          <main className="transition-all  duration-300">{children}</main>
        </main>
      ) : (
        <div className="flex md:pl-15">
          <div>
            <CustomerSideBar />
          </div>

          {openPanel && panel && (
            <div className="w-2/5 h-screen overflow-hidden border-r-2 border-r-black/10">
              <AnimatePresence>
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: 0 }}
                  exit={{ x: "-100%" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div>
                    {panel === "messages" ? (
                      <MessageScreen />
                    ) : panel === "notifications" ? (
                      <NotificationScreen />
                    ) : panel === "orders" ? (
                      <OrderScreen />
                    ) : null}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          <main className="flex-1 transition-all duration-300">{children}</main>
        </div>
      )}
    </div>
  );
}
