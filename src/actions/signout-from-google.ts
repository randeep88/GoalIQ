"use server";

import { signOut } from "@/auth";

export const signoutFromGoogle = async () => {
  await signOut({ redirectTo: "/login" });
};
