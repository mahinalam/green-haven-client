"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@nextui-org/button";
import Link from "next/link";
import { ChangeEvent, useEffect, useState } from "react";
import { FieldValues, SubmitHandler } from "react-hook-form";

import GTForm from "@/src/components/form/GTForm";
import GTInput from "@/src/components/form/GTInput";
import { useUser } from "@/src/context/user.provider";
import { useUserLogin, useUserRegistration } from "@/src/hooks/auth.hook";
import registerValidationSchema from "@/src/schemas/register.schema";
import loginValidationSchema from "@/src/schemas/login.schema";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getCurrentUser } from "@/src/services/AuthService";
import { useQueryClient } from "@tanstack/react-query";

export default function LoginPage() {
  const router = useRouter();
  const { setIsLoading: setUserLoading, setUser } = useUser();
  const queryClient = useQueryClient();

  const { mutate: handleUserLogin, isPending, isSuccess } = useUserLogin();

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const id = toast.loading("Logging in...");
    handleUserLogin(data, {
      onSuccess: async () => {
        const result = await getCurrentUser();
        setUserLoading(true);
        toast.success("Login successful! Welcome back 🎉", { id });
        queryClient.invalidateQueries({
          queryKey: ["SINGLE_USER", result?._id],
        });
      },
      onError: () => {
        toast.error("Login failed. Please check your email and password.", {
          id,
        });
      },
    });
  };
  useEffect(() => {
    if (!isPending && isSuccess) {
      router.push("/");
    }
  }, [isPending, isSuccess]);

  // handle credentails login
  const handleCredentailsLogin = async (data: {
    email: string;
    password: string;
  }) => {
    setUserLoading(true);
    const id = toast.loading("Logging in...");

    handleUserLogin(data, {
      onSuccess: async () => {
        const result = await getCurrentUser();
        setUser(result);
        queryClient.invalidateQueries({
          queryKey: ["SINGLE_USER", result?._id],
        });
        toast.success("Login successful! Welcome back 🎉", { id });
      },
      onError: () => {
        toast.error("Login failed. Please check your email and password.", {
          id,
        });
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center justify-center w-full">
        <h3 className="my-2 text-2xl font-bold">Login with GreenHaven</h3>
        <p className="mb-4">Welcome Back! Let&rsquo;s Get Started</p>
        <div className="flex gap-2 my-4">
          <button
            // type="submit"
            className="bg-primary p-2 text-white rounded-lg text-sm"
            onClick={() =>
              handleCredentailsLogin({
                email: "user@gmail.com",
                password: "123456",
              })
            }
          >
            User Credentials
          </button>
          <button
            className="bg-primary p-2 text-white rounded-lg text-sm"
            onClick={() =>
              handleCredentailsLogin({
                email: "admin@gmail.com",
                password: "123456",
              })
            }
          >
            Admin Credentials
          </button>
        </div>
        <div className="lg:w-[40%] w-full">
          <GTForm
            resolver={zodResolver(loginValidationSchema)}
            onSubmit={onSubmit}
          >
            <div className="py-3">
              <GTInput label="Email" name="email" size="sm" />
            </div>

            <div className="py-3">
              <GTInput
                label="Password"
                name="password"
                size="sm"
                type="password"
              />
            </div>
            <Button
              className="my-3 w-full rounded-md font-semibold text-white bg-primary"
              size="lg"
              type="submit"
            >
              Login
            </Button>
          </GTForm>
          <div className="text-center">
            Don&rsquo;t have an account? <Link href="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
