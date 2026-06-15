import crypto from "crypto";

type LinkedInConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function buildLinkedInService(linkedinConfig: LinkedInConfig) {
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
  };
}
