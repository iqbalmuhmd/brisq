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
        throw new Error("Failed to fetch token from auth service");
      }

      const result = await response.json();
      return result.data as { accessToken: string; personUrn: string | null };
    },
  };
}
