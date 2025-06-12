import type { Metadata } from "next";
import { Roboto_Slab } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/provider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "./(components)/navbar";

const roboto_Slab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-slab",
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
      <body className={`antialiased`}>
        {!session && redirect("/")}
        <AuthProvider>
          {/* Navbar */}
          <Navbar />
          <div className="max-w-7xl mx-auto">{children}</div>
          {/* Toast container */}
          <Toaster richColors position="bottom-left" />
        </AuthProvider>
      </body>
    </html>
  );
}
