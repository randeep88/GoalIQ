"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
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

type Form = {
  name: string;
  email: string;
  password: string;
};

export function RegisterDialog() {
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
        <Button variant="secondary">Register</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">New here?</DialogTitle>
          <DialogDescription>Create an account.</DialogDescription>
        </DialogHeader>
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
        <DialogFooter>
          <div className="flex flex-col gap-2 w-full">
            <Button
              type="submit"
              className="w-full"
              onClick={handleSubmit(onSubmit)}
            >
              Register
            </Button>
            <GoogleSignup />
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
