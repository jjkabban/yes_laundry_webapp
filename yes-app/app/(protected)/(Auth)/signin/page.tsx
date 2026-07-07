"use client";

import { Logo } from "@/components/ui";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import AppleLogo from "../../../../assets/apple_logo.svg";
import GoogleLogo from "../../../../assets/google_logo.png";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { router } from "next/client";
import { FloatingInput } from "@/components/form";
import {
  validateEmail,
  validatePassword,
  validatePhoneNumber,
} from "@/utils/validators";
import { useAuth } from "@/context/AuthContext";
import { Check } from "lucide-react";
import { useToast } from "@/context/ToastContext";

export default function SigninPage() {
  const [form, setForm] = useState<{
    password: string;
    phoneOrEmail: string;
  }>({ password: "", phoneOrEmail: "" });
  const router = useRouter();
  const [error, setError] = useState({ phoneOrEmail: "", password: "" });
  const { login } = useAuth();
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const onInputChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error[name as keyof typeof error]) {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateField = (name: string, value: string) => {
    const trimmed = value.trim();

    let currentError = "";

    if (trimmed.length < 1) {
      currentError = `${name === "phoneNumber" ? "Phone number" : name === "email" ? "email" : "Password"} is required`;
    } else if (name === "phoneNumber" && !validatePhoneNumber(trimmed)) {
      currentError = "Invalid phone number. Must be 10 digits.";
    } else if (name === "password" && !validatePassword(value)) {
      currentError = "Password must be at least 6 characters.";
    } else if (name === "email" && !validateEmail(value)) {
      currentError = "Invalid email";
    }
    setError((prev) => ({ ...prev, [name]: currentError }));
    return currentError;
  };

  const onSubmitForm = async () => {
    const isEmail = form.phoneOrEmail.includes("@");
    const trimmed = form.phoneOrEmail.trim();

    let phoneEmailError = "";
    if (!trimmed) {
      phoneEmailError = "Phone or email is required";
    } else if (isEmail && !validateEmail(trimmed)) {
      phoneEmailError = "Invalid email address";
    } else if (!isEmail && !validatePhoneNumber(trimmed)) {
      phoneEmailError = "Invalid phone number. Must be 10 digits.";
    }

    if (phoneEmailError) {
      setError((prev) => ({ ...prev, phoneOrEmail: phoneEmailError }));
    }

    const passwordError = validateField("password", form.password);
    if (phoneEmailError || passwordError) return;

    try {
      setIsLoading(true);
      const user = await login({
        password: form.password,
        email: isEmail ? form.phoneOrEmail : "",
        phoneNumber: isEmail ? "" : form.phoneOrEmail,
        rememberMe,
      });

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

      console.log(serverError);
      showToast(serverError, "error", 3000);
      if (Array.isArray(err?.error)) {
        err.error.forEach(
          ({ field, message }: { field: string; message: string }) => {
            setError((prev) => ({ ...prev, [field]: message }));
          },
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className=" py-5 w-full flex items-center justify-center ">
        <Logo height={200} width={200} />
      </div>

      <div className="flex flex-col items-center mt-10">
        <h3 className="font-semibold text-2xl mt-8">Welcome back!</h3>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmitForm();
        }}
      >
        <div className="mt-8 px-4 flex flex-col md:items-center">
          <div className="w-full md:w-1/2 xl:w-1/4 md:mx-auto">
            <FloatingInput
              label="Phone or Email"
              type="text"
              value={form.phoneOrEmail}
              name="phoneOrEmail"
              onChange={onInputChange}
              error={error.phoneOrEmail}
            />
            <FloatingInput
              label="Password"
              type="password"
              value={form.password}
              name="password"
              onChange={onInputChange}
              error={error.password}
            />
          </div>
        </div>

        <div className="flex   items-center justify-between w-full md:w-1/2 xl:w-1/4 px-3 pt-2  md:mx-auto mb-8">
          <div className="flex items-center gap-1.5">
            <div
              onClick={() => setRememberMe(!rememberMe)}
              className={`${rememberMe && "bg-brand"} h-4 w-4 border border-gray-300 rounded-sm overflow-hidden flex items-center justify-center`}
            >
              {rememberMe && <Check size={14} strokeWidth={2.4} color="#fff" />}
            </div>
            <span className="text-sm text-paragraph/70">Remember me</span>
          </div>
          <Link
            href={"forgot-password"}
            className="text-sm text-brand font-medium"
          >
            Forgot password?
          </Link>
        </div>

        <div className="mx-5 md:mx-0 md:flex flex-col md:items-center  justify-center">
          <motion.button
            onClick={() => {
              onSubmitForm();
            }}
            whileHover={{ opacity: 0.8, scale: 1.02 }}
            className="flex bg-brand cursor-pointer w-full md:w-1/2  xl:w-1/4 py-3 rounded-xl items-center justify-center"
          >
            {isLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : (
              <span className="text-white text-[15px] font-medium">Log in</span>
            )}
          </motion.button>
        </div>
      </form>

      <div className="mx-5 md:mx-8 flex flex-row items-center my-8 gap-2 md:justify-center">
        <div className="h-[0.9] w-1/2 bg-gray-400/50 md:w-1/4 xl:w-1/9" />
        <span className="text-paragraph/40 text-md">Or</span>
        <div className="h-[0.9] w-1/2 bg-gray-400/50 md:w-1/4 xl:w-1/9" />
      </div>

      <div className="flex flex-col mx-5">
        <motion.button
          onClick={() => {
            window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
          }}
          className="border-brand md:w-1/2 xl:w-1/4 md:mx-auto border-[1] mt-4 rounded-xl flex flex-row text-black font-medium items-center justify-center py-3 gap-2"
        >
          <div className="relative h-[30] w-[30]">
            <Image src={GoogleLogo} fill alt="google_logo" />
          </div>
          <span>Continue with Google</span>
        </motion.button>
        {/* <motion.button className="border-brand md:w-1/2 xl:w-1/4 md:mx-auto border-[1] mt-4 rounded-xl flex flex-row text-black font-medium items-center justify-center py-4 gap-2">
          <div className="relative h-[20] w-[20] self-start">
            <Image src={AppleLogo} fill alt="apple_logo" />
          </div>
          <span className="">Continue with Apple</span>
        </motion.button> */}

        <Link
          href={"/signup"}
          className="self-center py-4 font-semibold text-[18px] text-brand"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
}
