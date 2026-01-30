import React from "react";
import Providers from "../../providers";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <Providers>
      <div className="bg-muted flex min-h-svh items-center justify-center p-6 md:p-10">
        {children}
      </div>
    </Providers>
  );
}
