import bcrypt from "bcryptjs";
import { ConflictError, UserEntity } from "@brisq/common";
import { buildUserRepository } from "../../repositories/auth/user.repository";

type UserRepository = ReturnType<typeof buildUserRepository>;

export function buildRegisterService(userRepository: UserRepository) {
  return async (email: string, password: string) => {
    const userEntity = new UserEntity(email, password);
    userEntity.validate();
    
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) throw new ConflictError("Email already exist");

    const hashedPassword = await bcrypt.hash(userEntity.get().password, 10);

    const user = await userRepository.createUser(
      userEntity.get().email,
      hashedPassword,
    );

    return { id: user.id, email: user.email };
  };
}
