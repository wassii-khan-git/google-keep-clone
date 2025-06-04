import { signIn, signOut } from "next-auth/react";

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
