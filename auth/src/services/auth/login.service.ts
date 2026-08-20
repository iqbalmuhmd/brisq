import { BadRequestError, UnauthorizedError } from "@brisq/common";
import { buildUserRepository } from "../../repositories/auth/user.repository";
import { buildTokenService } from "./token.service";
import bcrypt from "bcryptjs";

type UserRepository = ReturnType<typeof buildUserRepository>;
type TokenService = ReturnType<typeof buildTokenService>;

export function buildLoginService(
  userRepository: UserRepository,
  tokenService: TokenService,
) {
  return async (email: string, password: string) => {
    if (!email || !password)
      throw new BadRequestError("email and password required");

    const user = await userRepository.findByEmail(email.trim().toLowerCase());

    if (!user) throw new UnauthorizedError("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) throw new UnauthorizedError("Invalid credentials");

    const token = tokenService.sign(user.id, user.email);

    return { token, userId: user.id, email: user.email };
  };
}
