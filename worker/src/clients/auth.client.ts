import { config } from "../config/env";
import { JobError } from "../errors/JobError";

export function buildAuthClient() {
  return {
    async getToken(userId: string, platform: string) {
      const response = await fetch(
        `${config.auth.url}/auth/token/${platform}`,
        {
          headers: {
            "x-internal-secret": config.interServiceSecret,
            "x-user-id": userId,
          },
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();

        let code: string | undefined;
        try {
          code = JSON.parse(errorBody).code;
        } catch {
          // not JSON: no code
        }

        throw new JobError(
          `Failed to fetch token: ${response.status} - ${errorBody}`,
          response.status,
          undefined,
          code,
        );
      }

      const result = await response.json();
      return result.data as { accessToken: string; personUrn: string | null };
    },
    async invalidateToken(
      userId: string,
      platform: string,
      accessToken: string,
    ) {
      const response = await fetch(
        `${config.auth.url}/auth/token/${platform}/invalidate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": config.interServiceSecret,
            "x-user-id": userId,
          },
          body: JSON.stringify({ accessToken }),
        },
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new JobError(
          `Failed to invalidate token: ${response.status} - ${errorBody}`,
          response.status,
        );
      }
    },
  };
}
