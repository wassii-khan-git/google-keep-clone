// middleware.ts

import { auth } from "@/lib/auth"; // Adjust the path to your auth.ts file
import { NextResponse } from "next/server";

// auth() is a function that returns a session object or null
// It's the official replacement for getToken() in Auth.js v5
export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth; // req.auth contains the session if the user is authenticated

  console.log("====================================");
  console.log("AUTH.JS v5 MIDDLEWARE");
  console.log("Pathname:", nextUrl.pathname);
  console.log("Is Logged In:", isLoggedIn);
  console.log("Session:", req.auth);
  console.log("====================================");

  const isDashboardPath = nextUrl.pathname.startsWith("/dashboard");
  const isAuthPath = nextUrl.pathname === "/" || nextUrl.pathname === "/signup";

  // Case 1: Trying to access a protected route without being logged in
  if (isDashboardPath && !isLoggedIn) {
    // Redirect to the login page, but also add a callbackUrl
    // so the user is sent back to the page they wanted after logging in.
    const loginUrl = new URL("/", nextUrl.origin);
    loginUrl.searchParams.append("callbackUrl", nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Case 2: Trying to access login/signup page while already logged in
  if (isAuthPath && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // Case 3: All other cases, allow the request to proceed
  return NextResponse.next();
});

// Your config remains the same. It defines which routes the middleware runs on.
export const config = {
  matcher: ["/dashboard/:path*", "/", "/signup"],
};
