import { buildRegisterService } from "../register.service";
import { ConflictError } from "@brisq/common";
import { mockUserRepository } from ".";

const registerService = buildRegisterService(mockUserRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("registerService", () => {
  it("creates a user and returns id and email", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    const result = await registerService("test@example.com", "password123");

    expect(result).toEqual({ id: "user-123", email: "test@example.com" });
    expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
  });

  it("throws ConflictError if email already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    await expect(
      registerService("test@example.com", "password123"),
    ).rejects.toThrow(ConflictError);
  });
});
