import { OperationTopNavBar } from "@/components/navigation";
import React from "react";

export default function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <OperationTopNavBar />
      {children}
    </div>
  );
}
