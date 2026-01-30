"use client";

import { IUser } from "@/types/auth";
import { createContext, useContext } from "react";

type AuthContextType = {
  user: IUser | null;
  isLoading: boolean;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
};
