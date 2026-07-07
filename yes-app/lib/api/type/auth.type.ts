import { User, UserLocation } from "@/types/shared/user.type";

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

export type ManualLocationPayload = {
  address: string;
  label: string;
  isDefault: boolean;
};

export type UserLocationPayload = UserLocation;
