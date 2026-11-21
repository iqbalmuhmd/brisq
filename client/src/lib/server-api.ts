import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/config/env";
import { paths } from "@/config/paths";
import { ApiRequestError, type ApiEnvelope } from "@/lib/api";

export async function serverFetch<T>(path: string): Promise<T> {
  const cookieStore = await cookies();

  let res: Response;
  try {
    res = await fetch(`${env.gatewayUrl}${path}`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });
  } catch {
    throw new ApiRequestError(0, "Can't reach the server.");
  }

  if (res.status === 401) {
    redirect(paths.auth.login.getHref());
  }

  const json = (await res.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!res.ok) {
    throw new ApiRequestError(
      res.status,
      json?.message ?? `Request failed (${res.status})`,
    );
  }

  if (!json) {
    throw new ApiRequestError(res.status, "Unexpected response from server.");
  }

  return json.data as T;
}
