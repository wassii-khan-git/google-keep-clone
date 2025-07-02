import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import "@/app/globals.css";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/provider";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Navbar from "./(components)/common/navbar";
import Sidebar from "./(components)/common/sidebar";

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
          {/* Toast container */}

          <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Navbar */}
            <header className="sticky top-0 z-20 bg-white shadow-sm">
              <Navbar
              // setIsMenuClicked={setIsMenuClicked}
              // isMenuClicked={isMenuClicked}
              />
            </header>

            {/* Main Content */}
            <div className="flex flex-1 flex-col md:flex-row">
              {/* Mobile Sidebar - Appears above content */}
              <div
                className={`
            md:hidden overflow-hidden transition-all duration-300 ease-in-out
            `}
                // ${isMenuClicked ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}
              >
                <Sidebar />
                {/* isMenuClicked={isMenuClicked} */}
              </div>

              {/* Desktop Sidebar - Fixed position */}
              <aside
                className={`
            hidden md:block fixed top-16 bottom-0 left-0 z-10
            transition-all duration-300 ease-in-out
            `}
                // ${isMenuClicked ? "w-20" : "w-60"}
              >
                <Sidebar />
                {/* isMenuClicked={isMenuClicked} */}
              </aside>

              {/* Main Content - Adjusts for sidebar */}
              <main
                className={`
            flex-1 p-4 transition-all duration-300 ease-in-out
            mt-4 md:mt-10
  
          `}
                // ${isMenuClicked ? "md:ml-20" : "md:ml-60"}
              >
                <div className="max-w-7xl mx-auto">
                  {/* Note Cards */}
                  {children}
                </div>
              </main>
            </div>
          </div>

          <Toaster richColors position="bottom-left" />
        </AuthProvider>
      </body>
    </html>
  );
}
