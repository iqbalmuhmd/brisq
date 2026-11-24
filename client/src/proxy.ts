import { NextResponse, type NextRequest } from "next/server";
import { paths } from "@/config/paths";
import { PATHNAME_HEADER } from "@/config/headers";

const TOKEN_COOKIE = "token";
const AUTH_PAGES = [paths.auth.login.getHref(), paths.auth.register.getHref()];

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const hasToken = request.cookies.has(TOKEN_COOKIE);

  if (AUTH_PAGES.includes(pathname)) {
    return hasToken
      ? NextResponse.redirect(
          new URL(paths.app.dashboard.getHref(), request.url),
        )
      : NextResponse.next();
  }

  if (hasToken) {
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
    "/login",
    "/register",
    "/dashboard/:path*",
    "/compose/:path*",
    "/history/:path*",
    "/notifications/:path*",
    "/account/:path*",
  ],
};
