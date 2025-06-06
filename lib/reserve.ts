import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function test(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.AUTH_SECRET });
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

// export const config = {
//   matcher: ["/dashboard/:path*", "/", "/signup"],
// };
