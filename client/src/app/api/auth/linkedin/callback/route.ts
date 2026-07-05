import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest) {
  const dashboard = (params = "") =>
    NextResponse.redirect(new URL(`/dashboard${params}`, req.url));

  const code = req.nextUrl.searchParams.get("code");
  const state = req.nextUrl.searchParams.get("state");
  const error = req.nextUrl.searchParams.get("error");

  if (error || !code || !state) {
    return dashboard("?error=oauth_failed");
  }
  try {
    const response = await fetch(
      `${GATEWAY_URL}/auth/linkedin/callback?code=${encodeURIComponent(code)}&state=${encodeURIComponent(state)}`,
      {
        headers: { cookie: req.headers.get("cookie") ?? "" },
        redirect: "manual",
      },
    );

    if (!response.ok) {
      return dashboard("?error=oauth_failed");
    }

    const body = await response.json();

    const redirect =
      body?.data?.status === "connected"
        ? dashboard()
        : dashboard("?error=oauth_failed");

    const setCookie = response.headers.get("set-cookie");
    if (setCookie) {
      redirect.headers.set("set-cookie", setCookie);
    }

    return redirect;
  } catch {
    return dashboard("?error=oauth_failed");
  }
}
