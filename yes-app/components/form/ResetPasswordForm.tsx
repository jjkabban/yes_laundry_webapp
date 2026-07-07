// components/ResetPasswordForm.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowRight,
  KeyRound,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";

type TokenState = "checking" | "valid" | "invalid" | "expired";
type SubmitState = "idle" | "submitting" | "success" | "error";

export default function ResetPasswordForm({ token }: { token: string | null }) {
  const router = useRouter();
  const [tokenState, setTokenState] = useState<TokenState>(
    token ? "checking" : "invalid",
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [error, setError] = useState<string | null>(null);

  // Validate the token as soon as the page loads
  useEffect(() => {
    if (!token) return;

    const checkToken = async () => {
      try {
        const res = await fetch(
          `/api/auth/reset-password/validate?token=${encodeURIComponent(token)}`,
        );
        if (!res.ok) {
          const data = await res.json().catch(() => null);
          setTokenState(data?.reason === "expired" ? "expired" : "invalid");
          return;
        }
        setTokenState("valid");
      } catch {
        setTokenState("invalid");
      }
    };

    checkToken();
  }, [token]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setSubmitState("submitting");
    setError(null);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(
          data?.message || "Something went wrong. Please try again.",
        );
      }

      setSubmitState("success");
      setTimeout(() => router.push("/signin"), 2500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setSubmitState("error");
    }
  };

  // Checking token validity
  if (tokenState === "checking") {
    return (
      <div className="flex flex-col items-center text-center py-8">
        <Loader2 size={28} className="text-brand animate-spin mb-4" />
        <p className="text-[14px] text-[#5a6472]">Verifying your link...</p>
      </div>
    );
  }

  // Invalid or expired token
  if (tokenState === "invalid" || tokenState === "expired") {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex items-center justify-center h-14 w-14 rounded-full bg-red-500/10 text-red-600 mb-6">
          <XCircle size={26} strokeWidth={1.8} />
        </span>
        <h1 className="text-2xl font-semibold text-paragraph tracking-tight">
          {tokenState === "expired" ? "Link expired" : "Invalid link"}
        </h1>
        <p className="mt-3 text-[14px] text-[#5a6472] leading-relaxed max-w-sm">
          {tokenState === "expired"
            ? "This password reset link has expired. Request a new one to continue."
            : "This password reset link isn't valid. It may have already been used."}
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex items-center gap-2 bg-gradient-to-r from-brand to-[#0a1929] text-white font-semibold text-[14px] px-6 py-3 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5"
        >
          Request a new link
          <ArrowRight size={15} />
        </Link>
      </div>
    );
  }

  // Success
  if (submitState === "success") {
    return (
      <div className="flex flex-col items-center text-center">
        <span className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
          <CheckCircle2 size={26} strokeWidth={1.8} />
        </span>
        <h1 className="text-2xl font-semibold text-paragraph tracking-tight">
          Password updated
        </h1>
        <p className="mt-3 text-[14px] text-[#5a6472] leading-relaxed">
          Redirecting you to sign in...
        </p>
      </div>
    );
  }

  // Valid token — show the form
  return (
    <>
      <span className="flex items-center justify-center h-14 w-14 rounded-full bg-brand/8 text-brand mb-6">
        <KeyRound size={22} strokeWidth={1.8} />
      </span>

      <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
        Account recovery
      </span>
      <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
        Set a new password
      </h1>
      <p className="mt-3 text-[14px] text-[#5a6472] leading-relaxed">
        Choose a strong password you haven't used before.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label
            htmlFor="password"
            className="block text-[12.5px] font-semibold text-paragraph mb-2"
          >
            New password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="At least 8 characters"
            className="w-full rounded-xl border border-paragraph/12 bg-[#FBFAF7] px-4 py-3.5 text-[14px] text-paragraph placeholder:text-[#8a92a0] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
          />
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-[12.5px] font-semibold text-paragraph mb-2"
          >
            Confirm password
          </label>
          <input
            id="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter your password"
            className="w-full rounded-xl border border-paragraph/12 bg-[#FBFAF7] px-4 py-3.5 text-[14px] text-paragraph placeholder:text-[#8a92a0] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
          />
        </div>

        {error && <p className="text-[13px] text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitState === "submitting"}
          className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-brand to-[#0a1929] text-white font-semibold text-[14px] px-6 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(10,25,41,0.5)] disabled:opacity-60 disabled:hover:gap-2 disabled:hover:translate-y-0"
        >
          {submitState === "submitting" ? "Updating..." : "Update password"}
          {submitState !== "submitting" && <ArrowRight size={15} />}
        </button>
      </form>
    </>
  );
}
