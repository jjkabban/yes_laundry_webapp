import { z } from "zod";

export const registerSchema = z.object({
  body: z
    .object({
      firstName: z.string().min(2, "First name must be at least 2 characters"),
      lastName: z.string().min(2, "Last name must be at least 2 characters"),
      password: z.string().min(8, "Password must be at least 8 characters"),

      email: z
        .email("Invalid email format")
        .nullable()
        .optional()
        .or(z.literal("")),
      phoneNumber: z
        .string()
        .min(10, "Invalid phone number")
        .nullable()
        .optional()
        .or(z.literal("")),
    })
    .refine(
      (data) => {
        const hasEmail = data.email && data.email.trim() !== "";
        const hasPhone = data.phoneNumber && data.phoneNumber.trim() !== "";

        return hasEmail || hasPhone;
      },
      {
        message:
          "You must provide either an email address or a phone number to register.",
        path: ["email"],
      },
    ),
});

export const loginSchema = z.object({
  body: z
    .object({
      password: z.string().min(8),
      email: z.email().nullable().optional().or(z.literal("")),
      phoneNumber: z.string().min(10).nullable().optional().or(z.literal("")),
      rememberMe: z.boolean().optional().default(false),
    })
    .refine(
      (data) => {
        return (
          (data.email && data.email.trim() !== "") ||
          (data.phoneNumber && data.phoneNumber.trim() !== "")
        );
      },
      {
        message:
          "You must provide either an email address or a phone number to register.",
        path: ["email"],
      },
    ),
});
