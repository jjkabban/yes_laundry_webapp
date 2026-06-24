"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";
import { Toast, ToastContextType, ToastType } from "./types/toast";

const ToastContext = createContext<ToastContextType | null>(null);

const STYLES: Record<
  ToastType,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  error: {
    bg: "bg-red-500",
    text: "text-white",
    icon: <AlertCircle size={18} className="shrink-0" />,
  },
  success: {
    bg: "bg-green-500",
    text: "text-white",
    icon: <CheckCircle size={18} className="shrink-0" />,
  },
  warning: {
    bg: "bg-amber-400",
    text: "text-amber-900",
    icon: <AlertTriangle size={18} className="shrink-0" />,
  },
  info: {
    bg: "bg-gray-800",
    text: "text-white",
    icon: <Info size={18} className="shrink-0" />,
  },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", duration = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, duration);
    },
    [],
  );

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-1000 flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence mode="sync">
          {toasts.map((toast) => {
            const style = STYLES[toast.type];
            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 420, damping: 32 }}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg min-w-[280px] max-w-[420px] ${style.bg} ${style.text}`}
              >
                {style.icon}
                <span className="text-[14px] font-medium flex-1 leading-snug">
                  {toast.message}
                </span>
                <button
                  onClick={() => dismiss(toast.id)}
                  className="opacity-70 hover:opacity-100 transition-opacity shrink-0"
                  aria-label="Dismiss"
                >
                  <X size={16} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within a ToastProvider");
  return ctx;
};
