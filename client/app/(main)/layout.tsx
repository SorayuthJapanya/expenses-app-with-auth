import React from "react";
import Providers from "../providers";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/shared/app-sidebar";
import { Toaster } from "react-hot-toast";
import AppNavbar from "@/components/shared/app-navbar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="antialiased text-foreground bg-background">
      <Providers>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full min-h-svh">
            <AppNavbar />
            {children}
          </main>
        </SidebarProvider>
        <Toaster />
      </Providers>
    </div>
  );
}
