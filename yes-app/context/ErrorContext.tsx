"use client";
import { api } from "@/lib/api/client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
} from "react";

export type ClientErrorEntry = {
  message: string;
  context?: string;
  stack?: string;
  url?: string;
  timestamp: string;
};

type FrontEndErrorsContextType = {
  logClientError: (message: string, context?: string, err?: unknown) => void;
};

const FrontendErrorContext = createContext<FrontEndErrorsContextType | null>(
  null,
);

const FLUSH_INTERVAL_MS = 10_000;
const MAX_QUEUE_SIZE = 20;

export default function FrontendErrorProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const queueRef = useRef<ClientErrorEntry[]>([]);

  const flush = useCallback(async () => {
    if (queueRef.current.length === 0) return;

    const batch = queueRef.current;
    queueRef.current = [];

    try {
      await api.post("/client-errors", { errors: batch });
    } catch {}
  }, []);

  const logClientError = useCallback(
    (message: string, context?: string, err?: unknown) => {
      queueRef.current.push({
        message,
        context,
        stack: err instanceof Error ? err.stack : undefined,
        url: typeof window !== "undefined" ? window.location.href : undefined,
        timestamp: new Date().toISOString(),
      });

      if (queueRef.current.length >= MAX_QUEUE_SIZE) {
        flush();
      }
    },
    [flush],
  );

  useEffect(() => {
    const interval = setInterval(flush, FLUSH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [flush]);

  useEffect(() => {
    const handleUnload = () => {
      if (queueRef.current.length === 0) return;

      navigator.sendBeacon?.(
        `${process.env.NEXT_PUBLIC_API_URL}/api/client-errors`,
        JSON.stringify({ errors: queueRef.current }),
      );
      queueRef.current = [];
    };

    window.addEventListener("beforeunload", handleUnload);
    return () => window.removeEventListener("beforeunload", handleUnload);
  }, []);

  return (
    <FrontendErrorContext.Provider value={{ logClientError }}>
      {children}
    </FrontendErrorContext.Provider>
  );
}

export const useClientError = () => {
  const context = useContext(FrontendErrorContext);
  if (!context) {
    throw new Error("Component must be in a FrontendErrorProvider");
  }
  return context;
};
