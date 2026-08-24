-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('LINKEDIN');

-- CreateTable
CREATE TABLE "PlatformToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PlatformToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlatformToken_userId_platform_key" ON "PlatformToken"("userId", "platform");

-- AddForeignKey
ALTER TABLE "PlatformToken" ADD CONSTRAINT "PlatformToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
