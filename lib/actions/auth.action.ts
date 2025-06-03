"use server";

import { UserModel } from "@/models/user.model";
import { signIn, signOut } from "../auth";
import DbConnect from "../db";

// login action
export const handleSignIn = async (url?: string) => {
  const result = await signIn("google", { redirectTo: url });
  return result;
};

// login action
export const handleSignOut = async () => {
  const result = await signOut({ redirectTo: "/" });
  return result;
};
