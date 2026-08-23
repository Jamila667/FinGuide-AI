import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // If logged in and trying to access login page, redirect to dashboard
    if (req.nextUrl.pathname === "/login" && req.nextauth.token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        // Only require auth for /dashboard routes
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
