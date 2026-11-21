import { IJobPayload } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildLinkedInClient } from "../clients/linkedin.client";
import { buildPostClient } from "../clients/post.client";
import { retryWithBackoff } from "../utils/retryWithBackoff";

type AuthClient = ReturnType<typeof buildAuthClient>;
type LinkedInClient = ReturnType<typeof buildLinkedInClient>;
type PostClient = ReturnType<typeof buildPostClient>;

export function buildLinkedInHandler(
  authClient: AuthClient,
  linkedInClient: LinkedInClient,
  postClient: PostClient,
) {
  return async (job: IJobPayload) => {
    const { accessToken, personUrn } = await authClient.getToken(
      job.userId,
      job.platform,
    );

    if (!personUrn) {
      throw new Error(
        "No LinkedIn person URN found for this user. Reconnect LinkedIn.",
      );
    }

    await retryWithBackoff(
      () => linkedInClient.post(accessToken, personUrn, job.content),
      3,
      2000,
    );

    await postClient.updateStatus(
      job.postId,
      job.platform,
      "SUCCEEDED",
      null,
      job.userId,
    );
  };
}
