/*
  Warnings:

  - A unique constraint covering the columns `[postId,platform]` on the table `PostPlatformStatus` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostPlatformStatus_postId_platform_key" ON "PostPlatformStatus"("postId", "platform");
