import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Metadata } from "next";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin", "latin-ext"],
  variable: "--font-poppins",
  weight: ["400"],
});

export const metadata: Metadata = {
  title: "Google Keep Clone",
  description: "Google Keep clone",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="eng">
      <body className={poppins.className}>
        {children}
        {/* Toast container */}
        <Toaster richColors position="bottom-left" />
      </body>
    </html>
  );
}
