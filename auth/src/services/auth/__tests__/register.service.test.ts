import { buildRegisterService } from "../register.service";
import { ConflictError } from "@brisq/common";
import { mockUserRepository } from ".";

const registerService = buildRegisterService(mockUserRepository);

beforeEach(() => {
  jest.clearAllMocks();
});

describe("registerService", () => {
  it("creates a user and returns id, email and name", async () => {
    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.createUser.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
      name: "Test User",
    });

    const result = await registerService({
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    });

    expect(result).toEqual({
      userId: "user-123",
      email: "test@example.com",
      name: "Test User",
    });
    expect(mockUserRepository.createUser).toHaveBeenCalledTimes(1);
    expect(mockUserRepository.createUser).toHaveBeenCalledWith({
      name: "Test User",
      email: "test@example.com",
      passwordHash: expect.any(String),
    });
  });

  it("throws ConflictError if email already exists", async () => {
    mockUserRepository.findByEmail.mockResolvedValue({
      id: "user-123",
      email: "test@example.com",
    });

    await expect(
      registerService({
        name: "Test User",
        email: "test@example.com",
        password: "password123",
      }),
    ).rejects.toThrow(ConflictError);
  });
});
