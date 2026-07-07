import React from "react";
export type SheetContextTypes = {
  openSheet: (index: number, content: React.ReactNode) => void;
  closeSheet: () => void;
};
