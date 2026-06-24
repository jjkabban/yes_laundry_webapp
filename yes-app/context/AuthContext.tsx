"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AuthContextType, User } from "./types/auth";
import {
  LoginPayload,
  RegisterPayload,
  VerifyUserPayload,
} from "@/lib/api/type/auth.type";
import {
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

  const login = async (userData: LoginPayload) => {
    const res = await loginUser(userData);
    if (res.success && res.data) {
      setUser(res.data);
    }
    return res.data;
  };
  const logout = async () => {
    const res = await logoutUser(user?.id as string);
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

  useEffect(() => {
    console.log("the user from auth is ", user);
  }, []);

  return (
    <AuthContext.Provider value={{ login, logout, user, register, verify }}>
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
