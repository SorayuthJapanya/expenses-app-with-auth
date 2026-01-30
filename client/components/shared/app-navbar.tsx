import { SidebarTrigger } from "../ui/sidebar";
import Logo from "../../assets/expense-logo.png";
import Image from "next/image";

export default function AppNavbar() {
  return (
    <div className="px-4 py-3 bg-background sticky top-0 z-20 shadow-md flex items-center gap-4">
      <div className="block md:hidden">
        <SidebarTrigger className="w-8 h-8"/>
      </div>

      {/* Logo */}
      <Image src={Logo} alt="logo" width={120} height={10}></Image>
    </div>
  );
}
