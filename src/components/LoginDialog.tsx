"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { GoogleSignup } from "./GoogleSignup";
import { useForm } from "react-hook-form";

interface Form {
  email: string;
  password: string;
}

export function LoginDialog() {
  const [isHidden, setIsHidden] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Form>();

  const onSubmit = (data: Form) => {
    console.log(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Login</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Welcome Back!</DialogTitle>
          <DialogDescription>Login to your account.</DialogDescription>
        </DialogHeader>
        <form>
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
        <DialogFooter>
          <div className="flex flex-col gap-2 w-full">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Login
            </Button>
            <GoogleSignup />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
