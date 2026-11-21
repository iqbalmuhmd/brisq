import { config } from "../config/env";

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
        throw new Error(
          `Failed to fetch token: ${response.status} - ${errorBody}`,
        );
      }

      const result = await response.json();
      return result.data as { accessToken: string; personUrn: string | null };
    },
  };
}
