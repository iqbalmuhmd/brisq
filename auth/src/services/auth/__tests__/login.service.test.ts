import { buildLoginService } from "../login.service";
import { UnauthorizedError } from "@brisq/common";
import { mockUserRepository, mockTokenService } from ".";
import bcrypt from "bcryptjs";

jest.mock("bcryptjs");

const loginService = buildLoginService(mockUserRepository, mockTokenService);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("loginService", () => {
  it("returns token and user data on valid credentials", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    mockTokenService.sign.mockReturnValue("fake-jwt-token");

    const result = await loginService("test@example.com", "password123");

    expect(result).toEqual({
      token: "fake-jwt-token",
      userId: "user-123",
      email: "test@example.com",
    });
  });

  it("throws UnauthorizedError if email not found", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);

    await expect(
      loginService("unknown@example.com", "password123"),
    ).rejects.toThrow(UnauthorizedError);
  });

  it("throws UnauthorizedError if password is wrong", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      passwordHash: "hashed-password",
    });
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    await expect(
      loginService("test@example.com", "wrongpassword"),
    ).rejects.toThrow(UnauthorizedError);
  });
});
