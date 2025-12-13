// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const TOKEN_COOKIE_NAME = "affiliate_token";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // skip untuk public routes tertentu (auth + change-password)
  if (
    pathname.startsWith("/login") ||
    pathname.startsWith("/forgot-password") ||
    pathname.startsWith("/affiliate/change-password") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const token = req.cookies.get(TOKEN_COOKIE_NAME)?.value;

  if (!token) {
    const loginUrl = new URL("/login", req.url);
    // optionally kirim redirect param supaya setelah login bisa balik
    loginUrl.searchParams.set("redirect", pathname || "/");
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};