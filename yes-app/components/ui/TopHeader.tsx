"use client";

import { ArrowLeft, Bell } from "lucide-react";
import { useRouter } from "next/navigation";

export const TopHeader = () => {
  const router = useRouter();

  return (
    <div className="flex justify-between items-center px-5 pt-4">
      <button
        onClick={() => router.back()}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-white/25"
      >
        <ArrowLeft size={18} className="text-white" />
      </button>
      <button
        onClick={() => router.push("/notifications")}
        className="flex items-center justify-center h-10 w-10 rounded-full bg-white/15 backdrop-blur-md ring-1 ring-white/20 transition-colors hover:bg-white/25"
      >
        <Bell size={18} className="text-white" />
      </button>
    </div>
  );
};
