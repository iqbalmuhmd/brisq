import { IJobPayload } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildPostClient } from "../clients/post.client";

type AuthClient = ReturnType<typeof buildAuthClient>;
type PostClient = ReturnType<typeof buildPostClient>;

export async function markTokenDeadAndFail(
  postClient: PostClient,
  authClient: AuthClient,
  job: IJobPayload,
  deadToken?: string,
) {
  if (deadToken) {
    try {
      await authClient.invalidateToken(job.userId, job.platform, deadToken);
    } catch (err) {
      console.error("Failed to invalidate dead token", {
        userId: job.userId,
        platform: job.platform,
        err,
      });
    }
  }

  await postClient.updateStatus(
    job.postId,
    job.platform,
    "FAILED",
    "LinkedIn session expired — reconnect to retry",
    "ACCESS_TOKEN_DEAD",
    job.userId,
  );
}
