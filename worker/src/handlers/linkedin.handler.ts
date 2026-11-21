import { IJobPayload, IStatusUpdate } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildLinkedInClient } from "../clients/linkedin.client";
import { retryWithBackoff, RETRYABLE_STATUSES_UPLOAD } from "../utils/retryWithBackoff";
import { JobError, StatusSyncError, UnknownOutcomeError } from "../errors";
import { markTokenDeadAndFail } from "./markTokenDeadAndFail";
import { buildS3Client } from "../clients/s3.client";

type AuthClient = ReturnType<typeof buildAuthClient>;
type LinkedInClient = ReturnType<typeof buildLinkedInClient>;
type ImageStore = ReturnType<typeof buildS3Client>;

type PublishStatusUpdate = (update: IStatusUpdate) => Promise<void>;

export function buildLinkedInHandler(
  authClient: AuthClient,
  linkedInClient: LinkedInClient,
  imageStore: ImageStore,
  publishStatusUpdate: PublishStatusUpdate,
) {
  return async (job: IJobPayload) => {
    let accessToken: string;
    let personUrn: string | null;
    let imageUrn: string | undefined;

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

    if (job.imageKey) {
      try {
        const bytes = await imageStore.getObject(job.imageKey);

        const upload = await retryWithBackoff(
          () => linkedInClient.initializeImageUpload(accessToken, personUrn),
          3,
          2000,
          RETRYABLE_STATUSES_UPLOAD,
        );

        await retryWithBackoff(
          () =>
            linkedInClient.uploadImage(accessToken, upload.uploadUrl, bytes),
          3,
          2000,
          RETRYABLE_STATUSES_UPLOAD,
        );

        imageUrn = upload.imageUrn;
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
    }

    try {
      await retryWithBackoff(
        () =>
          linkedInClient.post(accessToken, personUrn, job.content, imageUrn),
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
      if (!(err instanceof JobError) || [500, 502, 504].includes(err.status)) {
        throw new UnknownOutcomeError("LinkedIn post outcome unknown", err);
      }
      throw err;
    }
    try {
      await publishStatusUpdate({
        postId: job.postId,
        platform: job.platform,
        status: "SUCCEEDED",
      });
    } catch (err) {
      throw new StatusSyncError(
        "The LinkedIn operation succeeded. The status synchronization operation failed.",
        err,
      );
    }
  };
}
