"use client";

import { useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
import { useSession } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return null;

  if (!session) {
    router.push("/login");
  }

  return (
    <div className="max-w-7xl mx-auto">
      <Navbar session={session} />
      <main>{children}</main>
    </div>
  );
}
