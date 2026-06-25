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
import { Footer } from "@/components/navigation";

type SliderContentType = "messages" | "notifications";
export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { panel, openPanel } = usePanel();

  return (
    <div className="bg-foreground">
      <div className="md:hidden">
        <CustomerTabs />
        <main>{children}</main>
      </div>

      <div className="hidden md:flex">
        <CustomerSideBar />

        <div className="w-16 shrink-0" />

        {openPanel && panel && (
          <div className="w-2/5 h-screen overflow-y-auto border-r border-r-black/10">
            <AnimatePresence>
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {panel === "messages" ? (
                  <MessageScreen />
                ) : panel === "notifications" ? (
                  <NotificationScreen />
                ) : panel === "orders" ? (
                  <OrderScreen />
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <main className="flex-1 min-w-0 transition-all duration-300">
          {children}
          <Footer />
        </main>
      </div>
    </div>
  );
}
