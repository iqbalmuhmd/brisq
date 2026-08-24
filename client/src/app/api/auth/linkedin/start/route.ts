import { NextRequest, NextResponse } from "next/server";

const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:3000";

export async function GET(req: NextRequest) {
  const failed = () =>
    NextResponse.redirect(new URL("/dashboard?error=oauth_failed", req.url));

  try {
    const res = await fetch(`${GATEWAY_URL}/auth/linkedin`, {
      headers: { cookie: req.headers.get("cookie") ?? "" },
    });

    if (!res.ok) return failed();

    const body = await res.json();
    const url = body?.data?.url;

    if (!url) return failed();

    const redirect = NextResponse.redirect(url);

    const setCookie = res.headers.get("set-cookie");
    if (setCookie) {
      redirect.headers.set("set-cookie", setCookie);
    }

    return redirect;
  } catch {
    return failed();
  }
}
