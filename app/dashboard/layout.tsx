import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/ui/common/navbar";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/provider";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Keep Clone",
  description: "Google Keep clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthProvider>
        <body
          className={`${roboto.className} ${robotoMono.className} antialiased`}
        >
          {/* Navbar */}
          <Navbar />
          <div className="max-w-7xl mx-auto">{children}</div>
          {/* Toast container */}
          <Toaster richColors position="bottom-left" />
        </body>
      </AuthProvider>
    </html>
  );
}
