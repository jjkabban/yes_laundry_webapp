"use client";
import { useState } from "react";
import { motion } from "framer-motion";

type Props = {
  label: string;
  type?: string;
  className?: string;
  name: string;
  value: string;
  error?: string;
  onChange: (type: string, value: string) => void;
};

export default function FloatingInput({
  label,
  type = "text",
  className = "",
  name,
  error,
  value,
  onChange,
}: Props) {
  const [focused, setFocused] = useState(false);
  const isFloating = focused || value.length > 0;

  return (
    <div>
      <div
        className={`flex flex-col w-full mt-2.5 rounded-md border transition-colors relative px-4 pt-3 pb-2 ${
          focused ? "border-brand" : "border-gray-300"
        } ${className}`}
      >
        <motion.span
          animate={{
            y: isFloating ? -8 : 0,
            scale: isFloating ? 0.78 : 1,
            color: focused ? "#004a94" : "#9ca3af",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute left-4 top-4 origin-left font-medium pointer-events-none"
        >
          {label}
        </motion.span>
        <input
          type={type}
          value={value}
          required
          onChange={(e) => {
            onChange(name, e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="outline-none bg-transparent pt-3 text-black text-base w-full"
        />
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1 pl-1 transition-all">
          {error}
        </span>
      )}
    </div>
  );
}
