import { buildLinkedInService } from "../linkedin.service";
import { mockTokenRepository } from ".";
import { InternalServerError, NotFoundError, Platform } from "@brisq/common";

const fakeConfig = {
  clientId: "test-client-id",
  clientSecret: "test-client-secret",
  redirectUri: "http://localhost:8000/api/auth/linkedin/callback",
};

const linkedinService = buildLinkedInService(fakeConfig, mockTokenRepository);

beforeEach(() => {
  jest.clearAllMocks();
  jest.spyOn(global, "fetch").mockResolvedValue({} as Response);
});

describe("buildAuthUrl", () => {
  it("builds a LinkedIn auth URL with the correct query parameters", () => {
    const { url, state } = linkedinService.buildAuthUrl();

    const authUrl = new URL(url);

    expect(authUrl.origin).toBe("https://www.linkedin.com");
    expect(authUrl.pathname).toBe("/oauth/v2/authorization");

    expect(authUrl.searchParams.get("client_id")).toBe(fakeConfig.clientId);
    expect(authUrl.searchParams.get("response_type")).toBe("code");
    expect(authUrl.searchParams.get("redirect_uri")).toBe(
      fakeConfig.redirectUri,
    );
    expect(authUrl.searchParams.get("scope")).toBe(
      "openid profile email w_member_social",
    );
    expect(authUrl.searchParams.get("state")).toBe(state);
  });
});

describe("getValidToken", () => {
  it("throws NotFoundError when there is no token", async () => {
    mockTokenRepository.getToken.mockResolvedValue(null);

    await expect(
      linkedinService.getValidToken("user-123", Platform.LINKEDIN),
    ).rejects.toThrow(NotFoundError);
  });

  it("throws InternalServerError when the token is expired", async () => {
    mockTokenRepository.getToken.mockResolvedValue({
      accessToken: "old-token",
      expiresAt: new Date(Date.now() - 60 * 60 * 1000),
    });

    await expect(
      linkedinService.getValidToken("user-123", Platform.LINKEDIN),
    ).rejects.toThrow(InternalServerError);
  });

  it("returns the access token when the token is valid", async () => {
    mockTokenRepository.getToken.mockResolvedValue({
      accessToken: "valid-token",
      expiresAt: new Date(Date.now() + 60 * 60 * 1000),
    });

    const result = await linkedinService.getValidToken(
      "user-123",
      Platform.LINKEDIN,
    );

    expect(result).toBe("valid-token");
  });
});

describe("getTokenStatus", () => {
  it("returns connected false when there is no token", async () => {
    mockTokenRepository.getToken.mockResolvedValue(null);

    const result = await linkedinService.getTokenStatus(
      "user-123",
      Platform.LINKEDIN,
    );

    expect(result).toEqual({ connected: false });
  });

  it("returns connected true with expiresAt when a token exists", async () => {
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    mockTokenRepository.getToken.mockResolvedValue({
      accessToken: "valid-token",
      expiresAt,
    });

    const result = await linkedinService.getTokenStatus(
      "user-123",
      Platform.LINKEDIN,
    );

    expect(result).toEqual({ connected: true, expiresAt });
  });
});

describe("handleCallback", () => {
  it("exchanges the code and saves the token on success", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({
        access_token: "the-access-token",
        refresh_token: "the-refresh-token",
        expires_in: 3600,
      }),
    });

    await linkedinService.handleCallback("auth-code", "user-123");

    expect(mockTokenRepository.upsertToken).toHaveBeenCalledWith(
      "user-123",
      Platform.LINKEDIN,
      "the-access-token",
      "the-refresh-token",
      expect.any(Date),
    );
  });

  it("throws and does not save a token when LinkedIn responds with an error", async () => {
    (global.fetch as jest.Mock).mockResolvedValue({ ok: false });

    await expect(
      linkedinService.handleCallback("auth-code", "user-123"),
    ).rejects.toThrow(InternalServerError);

    expect(mockTokenRepository.upsertToken).not.toHaveBeenCalled();
  });
});
