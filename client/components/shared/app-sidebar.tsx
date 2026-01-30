"use client";

import { HandCoins, LayoutDashboard, LogOut, Wallet } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "@/contexts/auth-context";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useLogoutUser } from "@/hooks/user.hook";

// Menu items.
const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Income",
    url: "/income",
    icon: Wallet,
  },
  {
    title: "Expense",
    url: "/expense",
    icon: HandCoins,
  },
];

export default function AppSidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const { mutate: logout } = useLogoutUser();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup className="px-4 pt-10 pb-4 space-y-8">
          {/* Profile Section */}
          <div className="flex flex-col items-center gap-2">
            <Avatar>
              <AvatarImage
                src="https://img.freepik.com/premium-photo/memoji-emoji-handsome-smiling-man-white-background_826801-6987.jpg?semt=ais_hybrid&w=740&q=80"
                alt="@profile"
                className="rounded-full size-24 shadow-lg"
              />
            </Avatar>
            <p className="text-2xl font-semibold mt-2">{user?.username}</p>
          </div>

          {/* Menu Items */}
          <div className="flex flex-col gap-2">
            <ul className="space-y-2">
              {items.map((item) => {
                const isActive = pathname === item.url;

                return (
                  <li key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`px-4 py-6 transition-colors ${
                        isActive
                          ? "bg-violet-800 text-white hover:bg-violet-900 hover:text-white"
                          : "text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      <Link href={item.url} className="gap-4 items-center">
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </li>
                );
              })}
            </ul>

            {/* Logout Button */}
            <SidebarMenuButton
              asChild
              className="px-4 py-6 transition-colors hover:text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={() => logout()}
            >
              <div className="gap-4">
                <LogOut />
                <span>Logout</span>
              </div>
            </SidebarMenuButton>
          </div>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
