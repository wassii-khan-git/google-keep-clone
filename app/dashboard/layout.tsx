import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/provider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const openSans = Open_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["500"],
});

export const metadata: Metadata = {
  title: "Google Keep Clone",
  description: "Google Keep clone",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  return (
    <html lang="en">
      <body className={`${openSans.variable} antialiased`}>
        {!session && redirect("/")}
        <AuthProvider>
          {children}
          {/* Toast container */}
          <Toaster richColors position="bottom-left" />
        </AuthProvider>
      </body>
    </html>
  );
}
