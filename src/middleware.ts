import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight gate: presence-check the admin cookie at the edge.
// Full HMAC verification happens in server components/actions via lib/auth.
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
