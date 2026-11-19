import { PrismaClient } from "../../../generated/prisma/client";

export type CreateUserInput = {
  name: string;
  email: string;
  passwordHash: string;
};

export function buildUserRepository(prisma: PrismaClient) {
  return {
    findByEmail: async (email: string) => {
      return prisma.user.findUnique({ where: { email } });
    },
    findById: async (id: string) => {
      return prisma.user.findUnique({ where: { id } });
    },
    createUser: async ({ name, email, passwordHash }: CreateUserInput) => {
      return prisma.user.create({ data: { name, email, passwordHash } });
    },
  };
}
