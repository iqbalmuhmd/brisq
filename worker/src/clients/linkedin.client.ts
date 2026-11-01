import { JobError } from "../errors";

const LINKEDIN_VERSION = "202609";

export function buildLinkedInClient() {
  return {
    async post(accessToken: string, personUrn: string, content: string) {
      const response = await fetch("https://api.linkedin.com/rest/posts", {
        method: "POST",
        signal: AbortSignal.timeout(10000),
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "X-Restli-Protocol-Version": "2.0.0",
          "Linkedin-Version": LINKEDIN_VERSION,
        },
        body: JSON.stringify({
          author: `urn:li:person:${personUrn}`,
          commentary: content,
          lifecycleState: "PUBLISHED",
          distribution: {
            feedDistribution: "MAIN_FEED",
            targetEntities: [],
            thirdPartyDistributionChannels: [],
          },
          isReshareDisabledByAuthor: false,
          visibility: "PUBLIC",
        }),
      });

      if (!response.ok) {
        const errorBody = await response.text();
        const seconds = Number(response.headers.get("retry-after"));
        const retryAfterMs =
          Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;

        throw new JobError(
          `Failed to post to LinkedIn: ${response.status} - ${errorBody}`,
          response.status,
          retryAfterMs,
        );
      }
    },
  };
}
