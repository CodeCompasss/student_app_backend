// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("__session")?.value;

  // If no token and not already on /auth, redirect to login
  if (!token && !request.nextUrl.pathname.startsWith("/auth")) {
    const loginUrl = new URL("/auth", request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect all routes except /auth and /_next
export const config = {
  matcher: ["/((?!auth|_next|api|favicon.ico).*)"],
};
