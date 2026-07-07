import { api } from "./client";

import {
  LoginPayload,
  LoginResponse,
  RegisterPayload,
  RegisterResponse,
  VerifyUserPayload,
  VerifyUserResponse,
  ManualLocationPayload,
  UserLocationPayload,
} from "./type/auth.type";
import { ApiResponse } from "./type/response.api";
import { User } from "@/types/shared/user.type";

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

export const logoutUser = async () =>
  api.post<Promise<ApiResponse<null>>>("/auth/logout");

export const resendOtp = async (id: string) =>
  api.post<Promise<ApiResponse<null>>>("/auth/resend-otp", { id });

export const getLocation = async (
  url: string,
): Promise<ApiResponse<UserLocationPayload>> =>
  api.get<Promise<ApiResponse<UserLocationPayload>>>(url);

export const setManualLocation = async (data: ManualLocationPayload) =>
  api.post<Promise<ApiResponse<null>>>("/auth/location", {
    ...data,
  });

export const getMe = async () =>
  api.get<Promise<ApiResponse<User>>>("/auth/me");
