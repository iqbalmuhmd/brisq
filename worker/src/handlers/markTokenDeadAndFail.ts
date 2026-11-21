import { IJobPayload, IStatusUpdate } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";

type AuthClient = ReturnType<typeof buildAuthClient>;
type PublishStatusUpdate = (update: IStatusUpdate) => Promise<void>;

export async function markTokenDeadAndFail(
  publishStatusUpdate: PublishStatusUpdate,
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

  await publishStatusUpdate({
    postId: job.postId,
    platform: job.platform,
    status: "FAILED",
    errorCode: "ACCESS_TOKEN_DEAD",
    errorMessage: "LinkedIn session expired — reconnect to retry",
  });
}
