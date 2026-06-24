"use client";

import { FloatingInput } from "@/components/form";
import { useAuth } from "@/context/AuthContext";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "@/utils/validators";
import { motion } from "framer-motion";
import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { RegisterPayload } from "@/lib/api/type/auth.type";
import { useToast } from "@/context/ToastContext";

export default function SignupFormPage() {
  const type = useSearchParams().get("type");
  console.log("the param is", type);
  const [form, setForm] = useState<RegisterPayload>({
    password: "",
    phoneNumber: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const router = useRouter();
  const [errors, setErrors] = useState({
    password: "",
    phoneNumber: "",
    email: "",
    firstName: "",
    lastName: "",
  });
  const [serverError, setServerError] = useState();
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const onInputChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name: string, value: string) => {
    const trimmed = value.trim();

    let currentError = "";

    if (trimmed.length < 1) {
      currentError = `${name === "phoneNumber" ? "Phone number" : "Password"} is required`;
    } else if (name === "phoneNumber" && !validatePhoneNumber(trimmed)) {
      currentError = "Invalid phone number. Must be 10 digits.";
    } else if (name === "password" && !validatePassword(value)) {
      currentError = "Password must be at least 6 characters.";
    } else if (name === "email" && !validateEmail(trimmed)) {
      currentError = "Invalid email";
    }
    setErrors((prev) => ({ ...prev, [name]: currentError }));
    return currentError;
  };

  const onSubmitForm = async () => {
    const passwordError = validateField("password", form.password);

    const identifierError =
      type === "email"
        ? validateField("email", form.email)
        : type === "phone"
          ? validateField("phoneNumber", form.phoneNumber)
          : null;

    if (passwordError || identifierError) return;

    try {
      setIsLoading(true);
      const usrId = await register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: type === "email" ? form.email : "",
        password: form.password,
        phoneNumber: type === "phone" ? form.phoneNumber : "",
      });
      if (usrId) {
        const type = form.email ? "email" : form.phoneNumber ? "phone" : "";
        router.push(`/verify?id=${usrId}&type=${type}`);
      }
    } catch (err: any) {
      const serverError =
        err?.error?.[0]?.message ??
        err?.message ??
        "Invalid code. Please try again.";

      showToast(serverError, "error", 3000);
      if (Array.isArray(err?.error)) {
        err.error.forEach(
          ({ field, message }: { field: string; message: string }) => {
            setErrors((prev) => ({ ...prev, [field]: message }));
          },
        );
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen">
      <div className="flex items-center z-10 flex-row px-5 py-4 gap-6 shadow-sm fixed left-0 right-0 w-full bg-white">
        <ArrowLeft
          className="cursor-pointer shrink-0"
          onClick={() => router.back()}
        />
        <h4 className="text-xl sm:text-2xl font-meduim">Let's get in!</h4>
      </div>

      <div className="flex flex-col md:w-2/5 md:mx-auto items-center flex-1 min-h-screen relative pt-24 pb-10 px-4">
        <form
          className="w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            onSubmitForm();
          }}
        >
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-2">
            <FloatingInput
              type="text"
              label="First name"
              className="flex-1"
              onChange={onInputChange}
              error={errors.firstName}
              name={"firstName"}
              value={form.firstName}
            />
            <FloatingInput
              type="text"
              label="Last name"
              className="flex-1"
              onChange={onInputChange}
              error={errors.lastName}
              name={"lastName"}
              value={form.lastName}
            />
          </div>
          {type === "email" ? (
            <FloatingInput
              type="email"
              label="Email"
              onChange={onInputChange}
              error={errors.email}
              name={"email"}
              value={form.email}
            />
          ) : type === "phone" ? (
            <FloatingInput
              type="tel"
              label="Phone number"
              onChange={onInputChange}
              error={errors.phoneNumber}
              name={"phoneNumber"}
              value={form.phoneNumber}
            />
          ) : null}

          <FloatingInput
            type="password"
            label="Create password"
            onChange={onInputChange}
            error={errors.password}
            name={"password"}
            value={form.password}
          />

          <div className="mt-8 items-center justify-center flex flex-row ">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="bg-brand px-4 py-3.5 flex items-center justify-center rounded-xl cursor-pointer w-full hover:bg-brand/90 transition-colors"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <span className="text-white text-[15px] font-medium">
                  Sign up
                </span>
              )}
            </motion.button>
          </div>

          <div className="flex flex-row items-center gap-3 px-1 py-5">
            <div className="h-5 w-5 shrink-0 mt-0.5 flex items-center justify-center rounded-[6] border-2 border-brand bg-brand">
              <Check size={13} color="#fff" strokeWidth={3.4} />
            </div>
            <span className="text-paragraph/60 text-[13px] leading-relaxed">
              By continuing, you agree to our{" "}
              <Link href={"/terms"} className="text-brand font-medium">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={"/policy"} className="text-brand font-medium">
                Privacy Policy
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}
