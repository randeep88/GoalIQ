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
import axios from "axios";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type Form = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
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
    try {
      const res = await axios.post("/api/register", data);

      if (res.data === "User registered successfully") {
        router.push("/login");
        toast.success("User registered successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("User registration failed");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">New here?</CardTitle>
          <CardDescription>Create an account.</CardDescription>
          <CardAction>
            <Link href="/login">
              <Button variant="link">Login</Button>
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid gap-4">
              <div className="grid gap-3">
                <Label htmlFor="name-1">Name</Label>
                <Input
                  aria-invalid={errors.name ? true : false}
                  id="name-1"
                  placeholder="Enter your name"
                  {...register("name", {
                    required: "Name is required",
                  })}
                />
                {errors.name && (
                  <span className="text-destructive">
                    {errors?.name?.message}
                  </span>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email-1">Email</Label>
                <Input
                  aria-invalid={errors.email ? true : false}
                  id="email-1"
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
                <Label htmlFor="username-1">Password</Label>
                <div className="relative">
                  <Input
                    aria-invalid={errors.password ? true : false}
                    id="username-1"
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
            {isLoading ? "Registering..." : "Register"}
          </Button>
          <GoogleSignup />
        </CardFooter>
      </Card>
    </div>
  );
};

export default RegisterPage;
