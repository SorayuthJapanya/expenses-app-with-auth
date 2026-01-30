"use client";

import { AuthContext } from "@/contexts/auth-context";
import { useGetUser } from "@/hooks/user.hook";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useGetUser();

  return (
    <AuthContext.Provider value={{ user: user ?? null, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}
