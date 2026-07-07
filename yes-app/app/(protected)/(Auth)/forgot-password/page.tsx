// app/(auth)/forgot-password/page.tsx
"use client";

import { useState, FormEvent, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/ui";

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: "", phoneNumber: "" });
  const [isPhone, setIsPhone] = useState(false);
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.phoneNumber.trim()) return;

    setStatus("submitting");
    setError(null);

    try {
      setStatus("sent");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.",
      );
      setStatus("error");
    }
  };

  const onChangeValue = useCallback(
    (key: keyof typeof form, val: string) => {
      setForm((prev) => ({ ...prev, [key]: val }));
    },
    [form],
  );

  return (
    <main className="min-h-screen bg-[#FBFAF7] pt-20 px-6 ">
      <div className="w-full max-w-md">
        <div className="fixed bg-[#FBFAF7]  top-0 left-0 right-0 flex items-center justify-center py-4">
          <Logo height={200} width={200} />
        </div>

        <Link
          href="/signin"
          className="inline-flex items-center gap-1.5 text-[15px] font-medium text-[#5a6472] hover:text-brand transition-colors mb-8"
        >
          <ArrowLeft size={18} />
          Back to sign in
        </Link>

        <div className="rounded-[1.75rem] bg-white border border-black/[0.04] shadow-[0_20px_50px_-24px_rgba(10,25,41,0.15)] overflow-hidden">
          <div className="p-5 md:p-10">
            {status !== "sent" ? (
              <>
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
                  Account recovery
                </span>
                <h1 className="mt-3 text-2xl md:text-3xl font-semibold text-paragraph tracking-tight">
                  Forgot your password?
                </h1>
                <p className="mt-3 text-[14px] text-[#5a6472] leading-relaxed">
                  Enter your {isPhone ? "phone number" : "email"} and we will
                  send you a reset {isPhone ? "code" : "link"}
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="mt-8 flex flex-col gap-4"
                >
                  <div>
                    {isPhone ? (
                      <>
                        <label
                          htmlFor="phone"
                          className="block text-[14px] font-semibold text-paragraph mb-2"
                        >
                          Phone number
                        </label>
                        <input
                          id="phone"
                          type="tel"
                          autoComplete="phone"
                          value={form.phoneNumber}
                          onChange={(e) =>
                            onChangeValue("phoneNumber", e.target.value)
                          }
                          placeholder=""
                          className="w-full rounded-xl border border-paragraph/12 bg-[#FBFAF7] px-4 py-3.5 text-[14px] text-paragraph placeholder:text-[#8a92a0] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                        />
                      </>
                    ) : (
                      <>
                        <label
                          htmlFor="email"
                          className="block text-[14px] font-semibold text-paragraph mb-2"
                        >
                          Email address
                        </label>
                        <input
                          id="email"
                          type="email"
                          autoComplete="email"
                          value={form.email}
                          onChange={(e) =>
                            onChangeValue("email", e.target.value)
                          }
                          placeholder="you@example.com"
                          className="w-full rounded-xl border border-paragraph/12 bg-[#FBFAF7] px-4 py-3.5 text-[14px] text-paragraph placeholder:text-[#8a92a0] outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition-all"
                        />
                      </>
                    )}

                    <button
                      className="w-full text-center text-[14px] py-3 my-2 text-brand font-medium"
                      onClick={() => {
                        setIsPhone(!isPhone);
                      }}
                    >
                      {isPhone
                        ? "Use email instead"
                        : " Use phone number instead"}
                    </button>
                  </div>

                  {status === "error" && error && (
                    <p className="text-[13px] text-red-600">{error}</p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-brand to-[#0a1929] text-white font-semibold text-[14px] px-6 py-3.5 rounded-full transition-all duration-300 hover:gap-3 hover:-translate-y-0.5 hover:shadow-[0_10px_24px_-8px_rgba(10,25,41,0.5)] disabled:opacity-60 disabled:hover:gap-2 disabled:hover:translate-y-0"
                  >
                    {status === "submitting" ? "Sending..." : "Send reset link"}
                    {status !== "submitting" && (
                      <ArrowRight
                        size={15}
                        className="transition-transform duration-300"
                      />
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* Sent confirmation state */
              <div className="flex flex-col items-center text-center">
                <span className="flex items-center justify-center h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-600 mb-6">
                  <CheckCircle2 size={26} strokeWidth={1.8} />
                </span>

                <h1 className="text-2xl font-semibold text-paragraph tracking-tight">
                  Check your {isPhone ? "SMS" : "Inbox"}
                </h1>
                <p className="mt-3 text-[14px] text-[#5a6472] leading-relaxed max-w-sm">
                  We've sent a password reset {isPhone ? "code" : "link"} to{" "}
                  <span className="font-semibold text-paragraph">
                    {isPhone ? form.phoneNumber : form.email}
                  </span>
                  . It'll expire in 20 minutes.
                </p>

                <button
                  onClick={() => setStatus("idle")}
                  className="mt-6 text-[13px] font-semibold text-brand hover:underline"
                >
                  Didn't get it? Try a different{" "}
                  {isPhone ? "phone number" : "email"}
                </button>
              </div>
            )}
          </div>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#8a92a0]">
          Remember your password?{" "}
          <Link
            href="/signin"
            className="font-semibold text-brand hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
