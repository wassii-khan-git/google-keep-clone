import { signIn, signOut } from "next-auth/react";

export async function handleGoogleSignIn() {
  try {
    await signIn("google", {
      redirectTo: "/dashboard",
    });
  } catch (error) {
    // Handle the error appropriately
    throw error;
  }
}

export async function handleSignIn(redirectTo: string = "/dashboard") {
  try {
    await signIn("google", {
      redirectTo,
    });
  } catch (error) {
    // This will handle the redirect
    throw error;
  }
}

// login action
export const handleSignOut = async () => {
  const result = await signOut({ redirectTo: "/" });
  return result;
};
