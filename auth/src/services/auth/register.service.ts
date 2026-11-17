import bcrypt from "bcryptjs";
import { ConflictError } from "@brisq/common";
import { UserEntity } from "../../entities/UserEntity";
import { buildUserRepository } from "../../repositories/auth/user.repository";

type UserRepository = ReturnType<typeof buildUserRepository>;

export function buildRegisterService(userRepository: UserRepository) {
  return async (email: string, password: string) => {
    const userEntity = new UserEntity(email, password);

    const existingUser = await userRepository.findByEmail(userEntity.email);
    if (existingUser) throw new ConflictError("An account with this email already exists.");

    const hashedPassword = await bcrypt.hash(password, 10);
    const persistedUser = userEntity.toPersisted(hashedPassword);

    const user = await userRepository.createUser(
      persistedUser.email,
      persistedUser.password,
    );

    return { userId: user.id, email: user.email };
  };
}
