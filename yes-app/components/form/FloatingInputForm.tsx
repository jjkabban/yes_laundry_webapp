"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";

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
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div>
      <div
        className={`flex flex-col w-full mt-2.5 rounded-md border transition-colors relative px-4 pt-3 pb-2 ${
          focused ? "border-brand" : "border-gray-400"
        } ${className}`}
      >
        <motion.span
          animate={{
            y: isFloating ? -14 : 0,
            scale: isFloating ? 0.78 : 1,
            color: focused ? "#004a94" : "#9ca3af",
          }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="absolute left-4 top-4 origin-left font-medium pointer-events-none"
        >
          {label}
        </motion.span>
        <input
          type={
            type === "password" ? (showPassword ? "text" : "password") : type
          }
          value={value}
          required
          onChange={(e) => {
            onChange(name, e.target.value);
          }}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="outline-none bg-transparent pt-3 text-black text-base w-full"
        />

        {type === "password" && (
          <div>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8a92a0] hover:text-paragraph transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-500 mt-1 pl-1 transition-all">
          {error}
        </span>
      )}
    </div>
  );
}
