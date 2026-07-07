"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType } from "./types/auth";
import { User } from "@/types/shared/user.type";
import {
  LoginPayload,
  RegisterPayload,
  VerifyUserPayload,
} from "@/lib/api/type/auth.type";
import {
  getMe,
  loginUser,
  logoutUser,
  registerUser,
  verifyUser,
} from "@/lib/api/auth.api";

const AuthContext = createContext<AuthContextType | null>(null);

type Props = {
  initUser: User | null;
  children: React.ReactNode;
};

export default function AuthContextProvider({ children, initUser }: Props) {
  const [user, setUser] = useState<User | null>(initUser);
  const [isUserLoading, setIsUserLoading] = useState(false);

  const login = async (userData: LoginPayload) => {
    const res = await loginUser(userData);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res.data;
  };
  const logout = async () => {
    const res = await logoutUser();
    if (res.success) {
      setUser(null);
    }
  };
  const verify = async (data: VerifyUserPayload) => {
    const res = await verifyUser(data);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res.data;
  };
  const register = async (userData: RegisterPayload) => {
    const res = await registerUser(userData);
    if (res.success && res.data) {
      return res.data.id;
    }
  };
  const loadUser = () => {};
  const refetchUser = async () => {
    try {
      setIsUserLoading(true);
      const res = await getMe();

      if (res.success && res.data) {
        setUser(res.data);
      }
    } catch (err: any) {
      throw Error(err);
    } finally {
      setIsUserLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        refetchUser,
        isUserLoading,
        logout,
        user,
        register,
        verify,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("Component must be wrapped in an AuthProvider");
  }
  return context;
};
