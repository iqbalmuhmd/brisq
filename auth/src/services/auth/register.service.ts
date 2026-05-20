import bcrypt from "bcryptjs";
import { ConflictError, UserEntity } from "@brisq/common";
import { buildUserRepository } from "../../repositories/auth/user.repository";

type UserRepository = ReturnType<typeof buildUserRepository>;

export function buildRegisterService(userRepository: UserRepository) {
  return async (email: string, password: string) => {
    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) throw new ConflictError("Email already exist");

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const userEntity = new UserEntity(email, hashedPassword);
    userEntity.validate();

    const user = await userRepository.createUser(
      userEntity.get().email,
      userEntity.get().passwordHash,
    );

    return { id: user.id, email: user.email };
  };
}
