"use client";

import { cn, notify } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { SignInSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { handleSignIn } from "@/lib/actions/auth.action";
import { GoogleOutlined } from "@ant-design/icons";
import { getSession } from "next-auth/react";
import { signIn } from "@/lib/auth";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // use form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  // store user
  // const SignIn = async (values: z.infer<typeof SignInSchema>) => {
  //   try {
  //     setIsSubmitting(true);
  //     const response = await fetch(
  //       `${process.env.NEXT_PUBLIC_API_URL}/auth/signin`,
  //       {
  //         method: "POST",
  //         headers: {
  //           "content-type": "application/json",
  //         },
  //         body: JSON.stringify(values),
  //       }
  //     );

  //     const data = await response.json();
  //     console.log(data);
  //     if (data.success) {
  //       notify({ message: data.message, flag: data.success });
  //       reset();
  //       setIsSubmitting(false);
  //       router.push("/dashboard");
  //     } else {
  //       notify({ message: data.message, flag: data.success || false });
  //       setIsSubmitting(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     notify({ message: "Error occurred", flag: false });
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    console.log(values);
    // check for the SignIn api
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        notify({ message: "Invalid email or password", flag: false });
      } else if (result?.ok) {
        // Refresh the session and redirect
        await getSession();
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err) {
      console.error("Login error:", err);
      notify({ message: "An error occurred during login", flag: false });
    }
  };

  return (
    <div className={cn("flex flex-col gap-6 rounded-md", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription className="mt-2">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  autoComplete="email"
                  className={`${errors.email && "border border-red-500"}`}
                />
                {/* errors */}
                {errors.email && (
                  <label className="text-sm text-red-500">
                    {errors.email.message}
                  </label>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="password">Password</Label>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="12345678"
                  className={`${errors.password && "border border-red-500"}`}
                />
                {/* errors */}
                {errors.password && (
                  <label className="text-sm text-red-500">
                    {errors.password.message}
                  </label>
                )}
              </div>
              <div className="flex flex-col gap-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Authenticating..." : "Login"}
                </Button>
                {/* login with google */}
                <Button
                  type="button"
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => handleSignIn("/dashboard")}
                  disabled={isSubmitting}
                >
                  <GoogleOutlined /> Login with Google
                </Button>
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="hover:text-gray-600">
                Signup
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
