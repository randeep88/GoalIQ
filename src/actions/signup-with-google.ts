"use server";

import { signIn } from "@/auth";

export const signupWithGoogle = async () => {
  await signIn("google", { redirectTo: "/dashboard" });
};
