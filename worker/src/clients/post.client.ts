import { Platform } from "@brisq/common";
import { config } from "../config/env";
import { JobError } from "../errors";

export function buildPostClient() {
  return {
    async getStatus(postId: string, platform: Platform) {
      const response = await fetch(
        `${config.post.url}/posts/${postId}/platforms/${platform}/status`,
        {
          headers: {
            "x-internal-secret": config.interServiceSecret,
          },
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new JobError(
          `Failed to fetch post status: ${errorBody}`,
          response.status,
        );
      }
      const result = await response.json();
      return result.data as {
        status: "PENDING" | "SUCCEEDED" | "FAILED";
        errorCode: string | null;
      };
    },
  };
}
