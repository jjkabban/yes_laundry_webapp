import React from "react";
import { TopNavbar } from "@/components/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background">
      <TopNavbar />
      {children}
    </div>
  );
}
