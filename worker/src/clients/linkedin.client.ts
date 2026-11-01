import { JobError } from "../errors";
import { escapeLittleText } from "../utils/escapeLittleText";

const LINKEDIN_VERSION = "202609";

async function throwIfNotOk(response: Response, action: string): Promise<void> {
  if (response.ok) return;

  const errorBody = await response.text();
  const seconds = Number(response.headers.get("retry-after"));
  const retryAfterMs =
    Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : undefined;

  throw new JobError(
    `Failed to ${action}: ${response.status} - ${errorBody}`,
    response.status,
    retryAfterMs,
  );
}

export function buildLinkedInClient() {
  return {
    async initializeImageUpload(accessToken: string, personUrn: string) {
      const response = await fetch(
        "https://api.linkedin.com/rest/images?action=initializeUpload",
        {
          method: "POST",
          signal: AbortSignal.timeout(10000),
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
            "X-Restli-Protocol-Version": "2.0.0",
            "Linkedin-Version": LINKEDIN_VERSION,
          },
          body: JSON.stringify({
            initializeUploadRequest: { owner: `urn:li:person:${personUrn}` },
          }),
        },
      );
      await throwIfNotOk(response, "initialize LinkedIn image upload");

      const data = (await response.json()) as {
        value: { uploadUrl: string; image: string };
      };

      return { uploadUrl: data.value.uploadUrl, imageUrn: data.value.image };
    },

    async uploadImage(accessToken: string, uploadUrl: string, bytes: Buffer) {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        signal: AbortSignal.timeout(30000),
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: new Uint8Array(bytes),
      });
      await throwIfNotOk(response, "upload image to LinkedIn");
    },

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
          commentary: escapeLittleText(content),
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

      await throwIfNotOk(response, "post to LinkedIn");
    },
  };
}
