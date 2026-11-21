import { PrismaClient } from "../../../generated/prisma/client";
import { Platform } from "@brisq/common";

export function buildTokenRepository(prisma: PrismaClient) {
  return {
    upsertToken: async (
      userId: string,
      platform: Platform,
      accessToken: string,
      refreshToken: string | null,
      personUrn: string | null,
      expiresAt: Date,
    ) => {
      return prisma.platformToken.upsert({
        where: { userId_platform: { userId, platform } },
        update: {
          accessToken,
          refreshToken,
          expiresAt,
          linkedInPersonUrn: personUrn,
        },
        create: {
          userId,
          platform,
          accessToken,
          refreshToken,
          expiresAt,
          linkedInPersonUrn: personUrn,
        },
      });
    },

    getToken: async (userId: string, platform: Platform) => {
      return prisma.platformToken.findUnique({
        where: { userId_platform: { userId, platform } },
      });
    },

    deleteToken: async (userId: string, platform: Platform) => {
      return prisma.platformToken.delete({
        where: { userId_platform: { userId, platform } },
      });
    },
    invalidateToken: async (
      userId: string,
      platform: Platform,
      accessToken: string,
    ) => {
      return prisma.platformToken.deleteMany({
        where: { userId, platform, accessToken },
      });
    },
  };
}
