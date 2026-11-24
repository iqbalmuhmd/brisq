import { NextResponse, type NextRequest } from "next/server";
import { paths } from "@/config/paths";
import { PATHNAME_HEADER } from "@/config/headers";

const TOKEN_COOKIE = "token";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (request.cookies.has(TOKEN_COOKIE)) {
    const headers = new Headers(request.headers);
    headers.set(PATHNAME_HEADER, pathname + search);
    return NextResponse.next({ request: { headers } });
  }

  const loginUrl = new URL(
    paths.auth.login.getHref(pathname + search),
    request.url,
  );
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/compose/:path*",
    "/history/:path*",
    "/notifications/:path*",
    "/account/:path*",
  ],
};
