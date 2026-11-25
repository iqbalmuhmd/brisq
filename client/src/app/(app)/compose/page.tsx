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
    <ComposeForm
      userId={user?.userId ?? null}
      linkedInStatus={linkedInStatus}
    />
  );
}
