import { PrismaClient } from "../../../generated/prisma/client";
import { Platform } from "../../../generated/prisma/client";

export function buildPostRepository(prisma: PrismaClient) {
  return {
    create: async (
      userId: string,
      content: string,
      imageUrl: string | null,
      platformStatuses: { platform: Platform }[],
    ) => {
      return prisma.post.create({
        data: {
          userId,
          content,
          imageUrl,
          platformStatuses: { create: platformStatuses },
        },
        include: { platformStatuses: true },
      });
    },
  };
}
