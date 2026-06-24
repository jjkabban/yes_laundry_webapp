import {
  LoginPayload,
  RegisterPayload,
  VerifyUserPayload,
} from "@/lib/api/type/auth.type";

export type Roles = "CUSTOMER" | "ADMIN" | "STAFF";

export type User = {
  firstName: string;
  lastName: string;
  role: Roles;
  id: string;
  email: string;
  phoneNumber: string;
  profileImage: string;
};

export type AuthContextType = {
  login: (userData: LoginPayload) => Promise<User | undefined>;
  register: (userData: RegisterPayload) => Promise<undefined | string>;
  verify: (data: VerifyUserPayload) => Promise<User | undefined>;
  logout: () => void;
  user: User | null;
};
