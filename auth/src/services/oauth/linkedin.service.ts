import crypto from "crypto";
import { buildTokenRepository } from "../../repositories/token/token.repository";
import { InternalServerError, Platform } from "@brisq/common";

type LinkedInConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};
type TokenRepository = ReturnType<typeof buildTokenRepository>;

export function buildLinkedInService(
  linkedinConfig: LinkedInConfig,
  tokenRepository: TokenRepository,
) {
  return {
    buildAuthUrl() {
      const state = crypto.randomBytes(16).toString("hex");

      const params = new URLSearchParams({
        response_type: "code",
        client_id: linkedinConfig.clientId,
        redirect_uri: linkedinConfig.redirectUri,
        scope: "openid profile email w_member_social",
        state,
      });

      const url = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;

      return { url, state };
    },
    async handleCallback(code: string, userId: string) {
      const response = await fetch(
        "https://www.linkedin.com/oauth/v2/accessToken",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            grant_type: "authorization_code",
            code,
            client_id: linkedinConfig.clientId,
            client_secret: linkedinConfig.clientSecret,
            redirect_uri: linkedinConfig.redirectUri,
          }).toString(),
        },
      );

      if (!response.ok) {
        throw new InternalServerError("Failed to exchange authorization code");
      }

      const data = await response.json();

      const { access_token, refresh_token, expires_in } = data;

      const expiresAt = new Date(Date.now() + expires_in * 1000);

      await tokenRepository.upsertToken(
        userId,
        Platform.LINKEDIN,
        access_token,
        refresh_token,
        expiresAt,
      );
    },
  };
}
