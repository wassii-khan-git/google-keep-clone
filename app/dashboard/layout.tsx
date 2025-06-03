import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import "@/app/globals.css";
import Navbar from "@/components/ui/common/navbar";
import { SessionProvider } from "next-auth/react";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Google Notes Clone",
  description: "Google notes clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={`${roboto.variable} ${robotoMono.variable} antialiased`}
        >
          {/* Navbar */}
          <Navbar />
          <div className="max-w-7xl mx-auto">{children}</div>
        </body>
      </SessionProvider>
    </html>
  );
}
