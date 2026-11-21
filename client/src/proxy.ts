import { NextResponse, type NextRequest } from "next/server";
import { paths } from "@/config/paths";

const TOKEN_COOKIE = "token";

export function proxy(request: NextRequest) {
  if (request.cookies.has(TOKEN_COOKIE)) {
    return NextResponse.next();
  }

  const { pathname, search } = request.nextUrl;
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
