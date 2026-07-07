"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { ToastProvider } from "@/context/ToastContext";
import DashboardContextProvider from "@/context/DashboardContext";
import FrontendErrorProvider from "./ErrorContext";
import BookingDataContextProvider from "./BookingDataContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <DashboardContextProvider>
      <BookingDataContextProvider>
        <FrontendErrorProvider>
          <ToastProvider>
            <QueryClientProvider client={queryClient}>
              {children}
            </QueryClientProvider>
          </ToastProvider>
        </FrontendErrorProvider>
      </BookingDataContextProvider>
    </DashboardContextProvider>
  );
}
