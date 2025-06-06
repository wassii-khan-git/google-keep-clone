"use client";

import { SessionProvider } from "next-auth/react";

// Auth Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return <SessionProvider>{children}</SessionProvider>;
};
