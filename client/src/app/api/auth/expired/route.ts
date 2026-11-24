import { NextResponse, type NextRequest } from "next/server";
import { paths } from "@/config/paths";

export function GET(request: NextRequest) {
  const next = request.nextUrl.searchParams.get("next") ?? undefined;

  const response = NextResponse.redirect(
    new URL(paths.auth.login.getHref(next), request.url),
  );

  response.cookies.delete({ name: "token", path: "/" });

  return response;
}
