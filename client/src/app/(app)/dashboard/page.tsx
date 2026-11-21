import { LinkedInCard } from "@/features/linkedin/components/linkedin-card";
import { ApiRequestError } from "@/lib/api";
import { serverFetch } from "@/lib/server-api";
import type { LinkedInStatus, User } from "@/types/api";

const oauthMessages: Record<string, { text: string; isError: boolean }> = {
  connection_cancelled: {
    text: "You cancelled the LinkedIn connection.",
    isError: false,
  },
  oauth_failed: {
    text: "Connecting to LinkedIn failed. Please try again.",
    isError: true,
  },
};

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  const [user, linkedInStatus] = await Promise.all([
    serverFetch<User>("/auth/me").catch((err) => {
      if (err instanceof ApiRequestError) return null;
      throw err;
    }),
    serverFetch<LinkedInStatus>("/auth/linkedin/status/linkedin").catch(
      (err) => {
        if (err instanceof ApiRequestError) return null;
        throw err;
      },
    ),
  ]);

  const firstName = user?.name.split(" ")[0];
  const oauthMessage = error ? oauthMessages[error] : undefined;

  return (
    <>
      <header className="mb-11">
        <p className="font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="text-[34px] font-medium md:text-5xl">
          Welcome back
          {firstName ? (
            <>
              , <span className="text-brand">{firstName}.</span>
            </>
          ) : (
            "."
          )}
        </h1>
      </header>

      {oauthMessage && (
        <p
          role={oauthMessage.isError ? "alert" : "status"}
          className={
            oauthMessage.isError ? "text-destructive" : "text-muted-foreground"
          }
        >
          {oauthMessage.text}
        </p>
      )}

      <section className="mt-10">
        <h2 className="text-[13px] font-medium">Channels</h2>
        <LinkedInCard status={linkedInStatus} />
      </section>
    </>
  );
}
