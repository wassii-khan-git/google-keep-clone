import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export default async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    console.log("No token found, user is not authenticated.", token);
  }

  // Use the correct cookie name based on the environment
  const { pathname } = req.nextUrl;

  console.log("Token:", token);
  console.log("Pathname:", pathname);

  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if ((pathname === "/" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/signup"],
};
