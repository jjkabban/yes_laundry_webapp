import {
  LoginPayload,
  RegisterPayload,
  VerifyUserPayload,
} from "@/lib/api/type/auth.type";
import { User } from "@/types/shared/user.type";

export type AuthContextType = {
  login: (userData: LoginPayload) => Promise<User | undefined>;
  register: (userData: RegisterPayload) => Promise<undefined | string>;
  verify: (data: VerifyUserPayload) => Promise<User | undefined>;
  logout: () => void;
  user: User | null;
  refetchUser: () => void;
  isUserLoading: boolean;
};
