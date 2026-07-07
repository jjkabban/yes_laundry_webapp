"use client";
import React, { createContext, useContext, useState } from "react";
import { ActivePanelType, DashboardContextType } from "./types/dashboard";
import useWindow from "@/hooks/useWindow";

const DashboardContext = createContext<DashboardContextType | null>(null);

export default function DashboardContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isDesktop } = useWindow();
  const [panelState, setPanelState] = useState<{
    panel: ActivePanelType;
    open: boolean;
  }>({ panel: null, open: false });

  const onPanelSelect = (p: ActivePanelType) => {
    if (!isDesktop) return;
    setPanelState((prev) => ({
      panel: p,
      open: prev.panel === p ? !prev.open : true,
    }));
  };

  const onPanelClose = () => {
    setPanelState({ panel: null, open: false });
  };

  return (
    <DashboardContext.Provider
      value={{
        panel: panelState.panel as ActivePanelType,
        onPanelSelect,
        onPanelClose,
        openPanel: panelState.open,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export const usePanel = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("Component must be in a DashboardContext provider");
  }

  return context;
};
