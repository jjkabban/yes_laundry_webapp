"use client";

import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { resendOtp } from "@/lib/api/auth.api";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60;

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = searchParams.get("id");
  const type = searchParams.get("type");

  const { verify } = useAuth();

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(RESEND_COOLDOWN);
  const [canResend, setCanResend] = useState(false);
  const { showToast } = useToast();

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (countdown <= 0) {
      setCanResend(true);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const focusInput = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, "").slice(0, OTP_LENGTH);
      const newOtp = [...otp];
      digits.split("").forEach((d, i) => {
        if (index + i < OTP_LENGTH) newOtp[index + i] = d;
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + digits.length, OTP_LENGTH - 1);
      focusInput(nextIndex);
      if (newOtp.every((d) => d !== "")) submitOtp(newOtp.join(""));
      return;
    }

    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < OTP_LENGTH - 1) focusInput(index + 1);
    if (newOtp.every((d) => d !== "")) submitOtp(newOtp.join(""));
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      if (otp[index]) {
        const newOtp = [...otp];
        newOtp[index] = "";
        setOtp(newOtp);
      } else if (index > 0) {
        focusInput(index - 1);
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      focusInput(index - 1);
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      focusInput(index + 1);
    }
  };

  const submitOtp = async (code: string) => {
    if (!userId) return;
    try {
      setIsLoading(true);
      setError("");
      const user = await verify({ code, id: userId });
      if (user) {
        user.role === "ADMIN"
          ? router.replace("/admin-home")
          : user.role === "CUSTOMER"
            ? router.replace("/user-home")
            : user.role === "STAFF"
              ? router.replace("/staff-home")
              : null;
      }
    } catch (err: any) {
      const serverError =
        err?.error?.[0]?.message ??
        err?.message ??
        "Invalid code. Please try again.";
      setError(serverError);

      setOtp(Array(OTP_LENGTH).fill(""));
      setTimeout(() => focusInput(0), 50);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend || isResending || !userId) return;
    try {
      setIsResending(true);
      setError("");
      resendOtp(userId);
      showToast("A new code has been sent", "success");
      setCountdown(RESEND_COOLDOWN);
      setCanResend(false);
      setOtp(Array(OTP_LENGTH).fill(""));
      focusInput(0);
    } catch (err: any) {
      const msg =
        err?.error?.[0]?.message ?? err?.message ?? "Failed to resend code";
      showToast(msg, "error");
    } finally {
      setIsResending(false);
    }
  };
  const filledCount = otp.filter((d) => d !== "").length;

  return (
    <div className="min-h-screen">
      <div className="flex items-center z-10 flex-row px-5 py-4 gap-6 shadow-sm fixed left-0 right-0 w-full bg-white">
        <ArrowLeft
          className="cursor-pointer shrink-0"
          onClick={() => router.back()}
        />
        <h4 className="text-xl sm:text-2xl font-medium">Verify your account</h4>
      </div>

      <div className="flex flex-col md:w-2/5 md:mx-auto items-center min-h-screen relative pt-28 pb-10 px-6">
        <div className="w-full max-w-md mb-8">
          <p className="text-paragraph/70 text-[14px] leading-relaxed">
            We sent a 6-digit code to your{" "}
            <span className="font-semibold text-paragraph">
              {type === "email" ? "email address" : "phone number"}
            </span>
            . Enter it below to verify your account.
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          {otp.map((digit, index) => (
            <motion.input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onFocus={(e) => e.target.select()}
              animate={error ? { x: [0, -6, 6, -6, 6, 0] } : { x: 0 }}
              transition={{ duration: 0.4 }}
              className={`w-12 h-14 text-center text-xl font-semibold rounded-xl border-2 outline-none transition-colors
                ${digit ? "border-brand bg-brand/5" : "border-gray-200 bg-gray-50"}
                ${error ? "border-red-400 bg-red-50" : ""}
                focus:border-brand focus:bg-brand/5
              `}
            />
          ))}
        </div>

        <div className="flex gap-1.5 mb-8">
          {Array(OTP_LENGTH)
            .fill(null)
            .map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-200 ${
                  i < filledCount ? "w-5 bg-brand" : "w-1.5 bg-gray-200"
                }`}
              />
            ))}
        </div>

        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-red-500 text-[13px] mb-6 text-center"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        <div className="w-full max-w-md mb-6">
          <motion.button
            whileTap={{ scale: 0.98 }}
            onClick={() => submitOtp(otp.join(""))}
            disabled={isLoading || filledCount < OTP_LENGTH}
            className="bg-brand px-4 py-3.5 flex items-center justify-center rounded-xl cursor-pointer w-full hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="text-white text-[15px] font-medium">Verify</span>
            )}
          </motion.button>
        </div>

        <div className="flex items-center gap-1.5 text-[13px] text-paragraph/60">
          <span>Didn't receive a code?</span>
          {canResend ? (
            <button
              onClick={handleResend}
              disabled={isResending}
              className="text-brand font-medium hover:underline disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          ) : (
            <span className="text-paragraph/40">
              Resend in{" "}
              <span className="tabular-nums font-medium text-paragraph/60">
                {String(Math.floor(countdown / 60)).padStart(2, "0")}:
                {String(countdown % 60).padStart(2, "0")}
              </span>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
