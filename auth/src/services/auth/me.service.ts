import { UnauthorizedError } from "@brisq/common";
import { buildUserRepository } from "../../repositories/auth/user.repository";

type UserRepository = ReturnType<typeof buildUserRepository>;

export function buildMeService(userRepository: UserRepository) {
  return async (userId: string) => {
    const user = await userRepository.findById(userId);
    if (!user) throw new UnauthorizedError("User not found");

    return { userId: user.id, email: user.email, name: user.name };
  };
}
