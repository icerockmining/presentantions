import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight UX redirect only: presence-check the admin cookie at the edge so
// unauthenticated users get bounced to /admin/login without a flash of the page.
// This is NOT the real guarantee — the cookie is not verified here (no HMAC check),
// it can be present but invalid/expired/forged. The REAL guarantee is the
// server-side `requireAdmin()` called at the top of every admin server page and
// in every admin server action (see src/lib/auth.ts), before any DB access.
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next();
    const hasCookie = req.cookies.has("cgr_admin");
    if (!hasCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.search = `?next=${encodeURIComponent(pathname)}`;
      return NextResponse.redirect(url);
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
