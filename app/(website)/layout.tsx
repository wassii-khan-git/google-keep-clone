import "@/app/globals.css";
import { Poppins } from "next/font/google";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400"],
});

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="eng">
      <body className={poppins.className}>{children}</body>
    </html>
  );
}
