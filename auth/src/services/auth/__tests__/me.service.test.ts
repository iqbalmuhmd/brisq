import { buildMeService } from "../me.service";
import { UnauthorizedError } from "@brisq/common";
import { mockUserRepository } from ".";

const meService = buildMeService(mockUserRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("meService", () => {
  it("returns userId, email and name when the user exists", async () => {
    mockUserRepository.findById.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
      passwordHash: "hashed-password",
    });

    const result = await meService("user-123");

    expect(result).toEqual({
      userId: "user-123",
      email: "test@example.com",
      name: "Test User",
    });
    expect(mockUserRepository.findById).toHaveBeenCalledWith("user-123");
  });

  it("throws UnauthorizedError when the user does not exist", async () => {
    mockUserRepository.findById.mockResolvedValue(null);

    await expect(meService("missing-user")).rejects.toThrow(UnauthorizedError);
  });
});
