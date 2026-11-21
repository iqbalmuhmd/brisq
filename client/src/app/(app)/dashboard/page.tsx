import { CircleAlert } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LinkedInCard } from "@/features/linkedin/components/linkedin-card";
import { ApiRequestError } from "@/lib/api";
import { serverFetch } from "@/lib/server-api";
import { cn } from "@/lib/utils";
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
        <p className="mb-3.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          Dashboard
        </p>
        <h1 className="text-[34px] leading-[1.02] font-medium tracking-[-0.045em] text-balance text-foreground md:text-5xl">
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
        <Alert
          role={oauthMessage.isError ? "alert" : "status"}
          variant={oauthMessage.isError ? "destructive" : "default"}
          className={cn(
            "mb-10 gap-y-0",
            !oauthMessage.isError && "bg-transparent text-muted-foreground",
          )}
        >
          {oauthMessage.isError && (
            <CircleAlert strokeWidth={1.8} className="size-[15px]" />
          )}
          <AlertDescription
            className={cn(
              !oauthMessage.isError &&
                "text-[13px] leading-[1.45] text-muted-foreground",
            )}
          >
            {oauthMessage.text}
          </AlertDescription>
        </Alert>
      )}

      <section className="mb-14">
        <div className="flex items-baseline gap-3.5 border-t-2 border-rule-strong pt-3">
          <span className="font-mono text-[11px] text-brand">A</span>
          <h2 className="flex-1 text-[13px] font-medium text-foreground">
            Channels
          </h2>
        </div>
        <div className="grid grid-cols-3 border-b">
          <LinkedInCard status={linkedInStatus} />
        </div>
      </section>
    </>
  );
}
