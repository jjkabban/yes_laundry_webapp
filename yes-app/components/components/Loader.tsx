"use client";
import { RefreshCw } from "lucide-react";
export default function Loader(title: string) {
  return (
    <div className="flex items-center justify-center min-h-lvh w-full">
      <div className="text-center">
        <RefreshCw className="w-12 h-12 text-brand animate-spin mx-auto mb-4" />
        <p className="text-paragraph/60">{title}....</p>
      </div>
    </div>
  );
}
