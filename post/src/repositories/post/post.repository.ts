import {
  PrismaClient,
  Platform,
  PostStatus,
} from "../../../generated/prisma/client";

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

    updatePlatformStatus: async (
      postId: string,
      platform: Platform,
      status: PostStatus,
      errorMessage: string | null,
    ) => {
      return prisma.postPlatformStatus.update({
        where: { postId_platform: { postId, platform } },
        data: { status, errorMessage },
      });
    },

    findManyByUser: async (userId: string) => {
      return prisma.post.findMany({
        where: { userId },
        include: { platformStatuses: true },
        orderBy: { createdAt: "desc" },
      });
    },
  };
}
