"use client";

import { ThemeToggle } from "./ThemeToggle";
import { Separator } from "@/components/ui/separator";
import { LoginDialog } from "./LoginDialog";
import { RegisterDialog } from "./RegisterDialog";
import { Session } from "next-auth";
import { DropdownAvatar } from "./DropDownAvatar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logo from "../../public/logo.png";

const Navbar = ({ session }: { session: Session | null }) => {
  const isLoggedIn = !!session;

  const pathname = usePathname();

  return (
    <div className=" fixed top-0 w-full mx-auto left-0 right-0 bg-background/70 backdrop-blur-md z-50 border-b">
      <div className="flex justify-between py-4 w-7xl mx-auto h-full">
        <Link href="/" className="flex items-center gap-2">
          <Image src={logo} alt="Logo" width={30} height={30} />
          <h1 className="text-xl font-medium">GoalIQ</h1>
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/dashboard"
            className={`text-sm font-medium p-1 ${pathname === "/dashboard" ? "text-primary" : ""}`}
          >
            Dashboard
          </Link>
          <Link
            href="/goals"
            className={`text-sm font-medium p-1 ml-3 ${pathname === "/goals" ? "text-primary" : ""}`}
          >
            Goals
          </Link>
          <Separator orientation="vertical" className="mx-2 h-5 my-auto" />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-2 h-5 my-auto" />
          {isLoggedIn ? (
            <div>
              <DropdownAvatar session={session} />
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <LoginDialog />
              <RegisterDialog />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
