import { ComposeForm } from "@/features/posts/components/compose-form";
import { ApiRequestError } from "@/lib/api";
import { serverFetch } from "@/lib/server-api";
import type { LinkedInStatus, User } from "@/types/api";

export default async function ComposePage() {
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
  return (
    <>
      <header className="mb-10">
        <p className="mb-3.5 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          Compose
        </p>
        <h1 className="text-[34px] leading-[1.02] font-medium tracking-[-0.045em] text-balance text-foreground md:text-5xl">
          Write once.
        </h1>
        <p className="mt-3 text-[15px] text-muted-foreground">
          Publish to every connected channel at the same time.
        </p>
      </header>

      <ComposeForm
        userId={user?.userId ?? null}
        linkedInStatus={linkedInStatus}
      />
    </>
  );
}
