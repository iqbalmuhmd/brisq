import { cookies } from "next/headers";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const GATEWAY_URL = process.env.GATEWAY_URL ?? "http://localhost:3000";

  const { error } = await searchParams;

  async function getLinkedInStatus() {
    const cookieStore = await cookies();

    const res = await fetch(`${GATEWAY_URL}/auth/linkedin/status/linkedin`, {
      headers: { cookie: cookieStore.toString() },
      cache: "no-store",
    });

    if (!res.ok) return { connected: false };

    const body = await res.json();
    return body?.data ?? { connected: false };
  }

  const status = await getLinkedInStatus();

  const errorMessages: Record<string, string> = {
    connection_cancelled: "You cancelled the LinkedIn connection.",
    oauth_failed: "Connecting to LinkedIn failed. Please try again.",
  };

  const errorMessage = error ? errorMessages[error] : undefined;

  return (
    <main className="mx-auto max-w-2xl p-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      {errorMessage && (
        <div className="mt-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">
          {errorMessage}
        </div>
      )}

      {status.connected ? (
        <p className="mt-4">LinkedIn: Connected ✓</p>
      ) : (
        <a
          href="/api/auth/linkedin/start"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white"
        >
          Connect LinkedIn
        </a>
      )}
    </main>
  );
}
