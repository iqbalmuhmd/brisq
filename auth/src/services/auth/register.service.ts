import bcrypt from "bcryptjs";
import { ConflictError, UserEntity } from "@brisq/common";
import { buildUserRepository } from "../../repositories/auth/user.repository";

type UserRepository = ReturnType<typeof buildUserRepository>;

export function buildRegisterService(userRepository: UserRepository) {
  return async (email: string, password: string) => {
    const userEntity = new UserEntity(email, password);

    const existingUser = await userRepository.findByEmail(userEntity.email);
    if (existingUser) throw new ConflictError("Email already exist");

    const hashedPassword = await bcrypt.hash(password, 10);
    const persistedUser = userEntity.toPersisted(hashedPassword);

    const user = await userRepository.createUser(
      persistedUser.email,
      persistedUser.password,
    );

    return { userId: user.id, email: user.email };
  };
}
