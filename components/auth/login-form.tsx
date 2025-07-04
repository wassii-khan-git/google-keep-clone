"use client";

import { cn } from "@/lib/utils";
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
import { useRouter } from "next/navigation";
import { GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import { getSession, signIn } from "next-auth/react";
import { toast } from "sonner";
import { useState } from "react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SignInSchema>>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(false);

  const onSubmit = async (values: z.infer<typeof SignInSchema>) => {
    try {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error("Invalid email or password");
      } else if (result?.ok) {
        await getSession();
        toast.success("Login successful!");
        router.push("/dashboard/notes");
        router.refresh();
      }
    } catch (err) {
      if (err instanceof Error) {
        toast.error(err.message || "Error signing in");
      }
      toast.error("An unexpected error occurred. Please try again later.");
    }
  };

  // Fixed Google sign-in handler
  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      const result = await signIn("google", {
        callbackUrl: "/dashboard/notes", // Explicitly set callback URL
        redirect: false,
      });

      if (result?.url) {
        setLoading(false);
        // Redirect to the URL returned by NextAuth
        window.location.href = result.url;
      }
    } catch (error) {
      setLoading(false);
      console.error("Google sign-in error:", error);
      toast.error("Failed to sign in with Google");
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
                  {isSubmitting ? <LoadingOutlined /> : "Login"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className={`w-full mt-3 cursor-pointer ${
                    loading && "cursor-not-allowed"
                  } `}
                  onClick={handleGoogleSignIn}
                  disabled={isSubmitting}
                >
                  {loading ? (
                    <LoadingOutlined />
                  ) : (
                    <label className="cursor-pointer">
                      <GoogleOutlined className="cursor-pointer ml-2 " /> Login
                      with Google
                    </label>
                  )}
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
