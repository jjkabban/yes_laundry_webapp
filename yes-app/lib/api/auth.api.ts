import { api } from "./client";

import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyUserPayload,
  VerifyUserResponse,
} from "./type/auth.type";
import { ApiResponse } from "./type/response.api";
import { User } from "@/context/types/auth";

export const loginUser = async (
  userData: LoginPayload,
): Promise<ApiResponse<LoginResponse>> => {
  const res = await api.post<Promise<ApiResponse<LoginResponse>>>(
    "/auth/signin",
    {
      ...userData,
    },
  );
  return res;
};

export const registerUser = async (
  userData: RegisterPayload,
): Promise<ApiResponse<RegisterResponse>> =>
  await api.post<Promise<ApiResponse<RegisterResponse>>>("/auth/register", {
    ...userData,
  });

export const verifyUser = async (
  data: VerifyUserPayload,
): Promise<ApiResponse<VerifyUserResponse>> =>
  await api.post<Promise<ApiResponse<VerifyUserResponse>>>("/auth/verify", {
    ...data,
  });

export const logoutUser = async (id: string) =>
  api.post<Promise<ApiResponse<null>>>("/auth/logout", { id });

export const resendOtp = async (id: string) =>
  api.post<Promise<ApiResponse<null>>>("/auth/resend-otp", { id });
