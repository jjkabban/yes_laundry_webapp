import React from "react";
import { Footer, TopNavbar } from "@/components/navigation";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-background overflow-hidden w-full">
      <TopNavbar />
      {children}
      <Footer />
    </div>
  );
}
