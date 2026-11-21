import { NextRequest, NextResponse } from "next/server";
import { env } from "@/config/env";
import { type DashboardError, paths } from "@/config/paths";

const CANCEL_ERRORS = [
  "user_cancelled_login",
  "user_cancelled_authorize",
  "access_denied",
];

export async function GET(req: NextRequest) {
  const dashboard = (error?: DashboardError) =>
    NextResponse.redirect(new URL(paths.app.dashboard.getHref(error), req.url));

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error && CANCEL_ERRORS.includes(error)) {
    return dashboard("connection_cancelled");
  }

  if (error || !code || !state) {
    return dashboard("oauth_failed");
  }

  try {
    const response = await fetch(
      `${env.gatewayUrl}/auth/linkedin/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      {
        headers: { cookie: req.headers.get("cookie") ?? "" },
        redirect: "manual",
      },
    );

    if (!response.ok) {
      return dashboard("oauth_failed");
    }

    const body = await response.json();

    const redirect =
      body?.data?.status === "connected"
        ? dashboard()
        : dashboard("oauth_failed");

    for (const cookie of response.headers.getSetCookie()) {
      redirect.headers.append("set-cookie", cookie);
    }

    return redirect;
  } catch {
    return dashboard("oauth_failed");
  }
}
