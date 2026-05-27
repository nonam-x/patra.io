import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * BUG-08 fix: Server-side route protection.
 *
 * Checks for the `patra_logged_in` session indicator cookie set by the
 * auth hook. Redirects unauthenticated users to /login before serving
 * any protected page HTML/JS.
 *
 * NOTE: This is a lightweight check (cookie presence, not JWT validation).
 * Full auth verification still happens client-side via tRPC auth.me.
 * Once BUG-11 (httpOnly cookie migration) is complete, this middleware
 * should verify the actual JWT.
 */
export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get("patra_logged_in")?.value;

  if (!sessionCookie) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/forms/:path*"],
};
