import React from "react";
import AuthContextProvider from "@/context/AuthContext";
import SocketContextProvider from "@/context/SocketContext";
import { getCurrentUser } from "@/lib/api/auth.server";
import { ToastProvider } from "@/context/ToastContext";
import OrderContextProvider from "@/context/OrderContext";
import { Footer } from "@/components/navigation";
import OrderDraftContextProvider from "@/context/OrderDraftContext";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const data = await getCurrentUser();
  return (
    <div>
      <AuthContextProvider initUser={data?.data ?? null}>
        <SocketContextProvider user={data?.data ?? null}>
          <OrderContextProvider>
            <OrderDraftContextProvider>
              <ToastProvider>{children}</ToastProvider>
            </OrderDraftContextProvider>
          </OrderContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </div>
  );
}
