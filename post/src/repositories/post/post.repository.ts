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
      imageKey: string | null,
      platformStatuses: { platform: Platform }[],
    ) => {
      return prisma.post.create({
        data: {
          userId,
          content,
          imageKey,
          platformStatuses: { create: platformStatuses },
        },
        include: { platformStatuses: true },
      });
    },

    getPlatformStatus: async (postId: string, platform: Platform) => {
      return prisma.postPlatformStatus.findUnique({
        where: { postId_platform: { postId, platform } },
      });
    },

    updatePlatformStatus: async (
      postId: string,
      platform: Platform,
      status: PostStatus,
      errorMessage: string | null,
      errorCode: string | null,
    ) => {
      return prisma.postPlatformStatus.updateMany({
        where: { postId, platform, status: { not: "PENDING" } },
        data: { status, errorMessage, errorCode },
      });
    },

    retryPlatformStatus: async (
      postId: string,
      platform: Platform,
      userId: string,
    ) => {
      return prisma.postPlatformStatus.updateMany({
        where: {
          postId,
          platform,
          status: "FAILED",
          errorCode: "ACCESS_TOKEN_DEAD",
          post: { userId },
        },
        data: {
          status: "PENDING",
          errorCode: null,
          errorMessage: null,
        },
      });
    },

    findManyByUser: async (userId: string) => {
      return prisma.post.findMany({
        where: { userId },
        include: { platformStatuses: true },
        orderBy: { createdAt: "desc" },
      });
    },

    findByIdForUser: async (postId: string, userId: string) => {
      return prisma.post.findFirst({
        where: { id: postId, userId },
        include: { platformStatuses: true },
      });
    },

    findPostOwner: async (postId: string) => {
      return prisma.post.findUnique({
        where: { id: postId },
        select: { userId: true },
      });
    },
  };
}
