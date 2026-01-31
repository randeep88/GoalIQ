"use client";

import { redirect } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") return null;

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Navbar session={session} />
      <main>{children}</main>
    </div>
  );
}
