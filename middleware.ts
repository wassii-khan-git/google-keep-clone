import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  // GET THE token
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
  });

  // extract the pathname
  const { pathname } = req.nextUrl;

  // if there is no token and access the dashboard redirect to the login or /
  if (pathname.startsWith("/dashboard") && !token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // if there is token
  if ((pathname === "/" || pathname === "/signup") && token) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/", "/signup"],
};
