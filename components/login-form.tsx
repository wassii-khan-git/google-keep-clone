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
import { useRouter } from "next/navigation";
import { handleSignIn } from "@/lib/actions/auth.action";
import { GoogleOutlined, LoadingOutlined } from "@ant-design/icons";
import { getSession, signIn } from "next-auth/react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // use form
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
        router.push("/dashboard");
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
                  {isSubmitting ? <LoadingOutlined /> : "Login"}
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
