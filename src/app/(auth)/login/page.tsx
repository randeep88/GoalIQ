"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleSignup } from "@/src/components/GoogleSignup";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Form {
  email: string;
  password: string;
}

const LoginPage = () => {
  const [isHidden, setIsHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = async (data: Form) => {
    setIsLoading(true);
    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    setIsLoading(false);
    if (res?.error === "CredentialsSignin") {
      toast.error("Invalid credentials");
    }
    if (res?.error === "EmailSignin") {
      toast.error("Invalid email");
    }
    if (res?.error === "PasswordSignin") {
      toast.error("Invalid password");
    }

    if (res?.url != null) {
      toast.success("Logged in successfully");
      router.push("/dashboard");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Welcome Back!</CardTitle>
          <CardDescription>Login to your account.</CardDescription>
          <CardAction>
            <Link href="/register">
              <Button variant="link">Sign Up</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  aria-invalid={errors.email ? true : false}
                  placeholder="Enter your email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                />
                {errors.email && (
                  <span className="text-destructive">
                    {errors?.email?.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    aria-invalid={errors.password ? true : false}
                    id="password"
                    type={isHidden ? "password" : "text"}
                    placeholder="Enter your password"
                    className="pr-10"
                    {...register("password", {
                      required: "Password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      },
                    })}
                  />
                  <Button
                    type="button"
                    onClick={() => setIsHidden(!isHidden)}
                    variant="ghost"
                    className="absolute right-0 top-0"
                  >
                    {isHidden ? <Eye /> : <EyeOff />}
                  </Button>
                </div>
                {errors.password && (
                  <span className="text-destructive">
                    {errors?.password?.message}
                  </span>
                )}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? "Logging in..." : "Login"}
          </Button>
          <GoogleSignup />
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginPage;
