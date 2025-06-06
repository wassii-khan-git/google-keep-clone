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
import { SignUpSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LoadingOutlined } from "@ant-design/icons";
import { toast } from "sonner";

interface SignupProps {
  username: string;
  email: string;
  password: string;
}

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  // use form
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const router = useRouter();

  // store user
  const SignUp = async (values: SignupProps) => {
    try {
      const response = await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await response.json();
      console.log(data);
      if (data.success) {
        toast.success(data.message || "Signup successful");
        reset();
        setTimeout(() => {
          router.push("/"); // redirect to Login page
        }, 2000);
      } else {
        toast.error(data.message || "Signup Failed!");
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast.error(error.message || "Signup Failed!");
      }
      toast.error("Error occurred");
    }
  };

  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    console.log(values);
    // check for the Signup api
    await SignUp(values);
  };

  return (
    <div className={cn("flex flex-col gap-6 rounded-md", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription className="mt-2">Create an Account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="username">Username</Label>
                <Input
                  {...register("username")}
                  id="username"
                  type="username"
                  placeholder="test"
                  required
                  autoComplete="username"
                  className={`${errors.username && "border border-red-500"}`}
                />
                {/* errors */}
                {errors.username && (
                  <label className="text-sm text-red-500">
                    {errors.username.message}
                  </label>
                )}
              </div>
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register("email")}
                  id="email"
                  type="email"
                  placeholder="test@example.com"
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
                {/* Forgot password */}
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  {/* <a
                    href="#"
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </a> */}
                </div>
                <Input
                  {...register("password")}
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className={`${errors.password && "border border-red-500"}`}
                  placeholder="123456"
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
                  {isSubmitting ? <LoadingOutlined /> : "Signup"}
                </Button>
                {/* Signup with google */}
                {/* <Button variant="outline" className="w-full mt-3">
                  Signup with Google
                </Button> */}
              </div>
            </div>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/" className="hover:text-gray-600">
                SignIn
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
