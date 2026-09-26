import { config } from "../config/env";

export function buildPostClient() {
  return {
    async updateStatus(
      postId: string,
      platform: string,
      status: string,
      errorMessage: string | null,
      errorCode: string | null,
      userId: string,
    ) {
      const response = await fetch(
        `${config.post.url}/posts/${postId}/platform-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": config.interServiceSecret,
            "x-user-id": userId,
          },
          body: JSON.stringify({ platform, status, errorMessage, errorCode }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(
          `Failed to update post platform status: ${response.status} - ${errorBody}`,
        );
      }

      const result = await response.json();
      return result.data;
    },
  };
}
