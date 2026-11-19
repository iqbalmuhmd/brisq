import { paths } from "@/config/paths";

const BASE = "http://brisq.site";

export function safeNext(next: string | string[] | undefined): string {
  const fallback = paths.app.dashboard.getHref();
  if (typeof next !== "string" || next === "") return fallback;

  try {
    const url = new URL(next, BASE);
    if (url.origin !== BASE) return fallback;
    return url.pathname + url.search + url.hash;
  } catch {
    return fallback;
  }
}
