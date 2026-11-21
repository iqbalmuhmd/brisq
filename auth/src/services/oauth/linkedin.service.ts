import crypto from "crypto";
import { buildTokenRepository } from "../../repositories/token/token.repository";
import { InternalServerError, NotFoundError, Platform } from "@brisq/common";

type LinkedInConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};
type TokenRepository = ReturnType<typeof buildTokenRepository>;

function isTokenLive<T extends { expiresAt: Date }>(
  token: T | null,
): token is T {
  return token !== null && token.expiresAt > new Date();
}

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

      const userInfoResponse = await fetch(
        "https://api.linkedin.com/v2/userinfo",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      );

      if (!userInfoResponse.ok) {
        throw new InternalServerError("Failed to fetch LinkedIn user info");
      }

      const userInfo = await userInfoResponse.json();
      const personUrn = userInfo.sub;

      await tokenRepository.upsertToken(
        userId,
        Platform.LINKEDIN,
        access_token,
        refresh_token,
        personUrn,
        expiresAt,
      );
    },
    async getValidToken(userId: string, platform: Platform) {
      const token = await tokenRepository.getToken(userId, platform);

      if (!isTokenLive(token))
        throw new NotFoundError("LinkedIn token missing or expired");

      return {
        accessToken: token.accessToken,
        personUrn: token.linkedInPersonUrn,
      };
    },
    async getTokenStatus(userId: string, platform: Platform) {
      const token = await tokenRepository.getToken(userId, platform);

      if (!isTokenLive(token)) return { connected: false };

      return { connected: true, expiresAt: token.expiresAt };
    },
    async invalidateToken(
      userId: string,
      platform: Platform,
      accessToken: string,
    ) {
      await tokenRepository.invalidateToken(userId, platform, accessToken);
    },
  };
}
