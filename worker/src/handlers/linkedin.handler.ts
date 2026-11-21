import { IJobPayload, IStatusUpdate } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildLinkedInClient } from "../clients/linkedin.client";
import { retryWithBackoff } from "../utils/retryWithBackoff";
import { JobError } from "../errors";
import { markTokenDeadAndFail } from "./markTokenDeadAndFail";

type AuthClient = ReturnType<typeof buildAuthClient>;
type LinkedInClient = ReturnType<typeof buildLinkedInClient>;

type PublishStatusUpdate = (update: IStatusUpdate) => Promise<void>;

export function buildLinkedInHandler(
  authClient: AuthClient,
  linkedInClient: LinkedInClient,
  publishStatusUpdate: PublishStatusUpdate,
) {
  return async (job: IJobPayload) => {
    let accessToken: string;
    let personUrn: string | null;

    try {
      const result = await authClient.getToken(job.userId, job.platform);
      accessToken = result.accessToken;
      personUrn = result.personUrn;
    } catch (err) {
      if (
        err instanceof JobError &&
        err.status === 404 &&
        err.code === "TOKEN_DEAD"
      ) {
        await markTokenDeadAndFail(publishStatusUpdate, authClient, job);
        return;
      }
      throw err;
    }

    if (!personUrn) {
      await markTokenDeadAndFail(
        publishStatusUpdate,
        authClient,
        job,
        accessToken,
      );
      return;
    }

    try {
      await retryWithBackoff(
        () => linkedInClient.post(accessToken, personUrn, job.content),
        3,
        2000,
      );
    } catch (err) {
      if (err instanceof JobError && err.status === 401) {
        await markTokenDeadAndFail(
          publishStatusUpdate,
          authClient,
          job,
          accessToken,
        );
        return;
      }
      throw err;
    }

    await publishStatusUpdate({
      postId: job.postId,
      platform: job.platform,
      status: "SUCCEEDED",
    });
  };
}
