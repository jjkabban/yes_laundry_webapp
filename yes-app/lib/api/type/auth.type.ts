import { User } from "@/context/types/auth";
export type LoginPayload = {
  phoneNumber: string;
  password: string;
  email: string;
  rememberMe: boolean;
};

export type LoginResponse = User;

export type RegisterPayload = {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  password: string;
  email: string;
};

export type RegisterResponse = {
  id: string;
};

export type VerifyUserPayload = {
  code: string;
  id: string;
};

export type VerifyUserResponse = User;
