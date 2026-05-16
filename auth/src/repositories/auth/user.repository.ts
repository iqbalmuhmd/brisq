import { PrismaClient } from "../../../generated/prisma/client";

export function buildUserRepository(prisma: PrismaClient) {
  return {
    findByEmail: async (email: string) => {
      return prisma.user.findUnique({ where: { email } });
    },
    findById: async (id: string) => {
      return prisma.user.findUnique({ where: { id } });
    },
    createUser: async (email: string, passwordHash: string) => {
      return prisma.user.create({ data: { email, passwordHash } });
    },
  };
}
