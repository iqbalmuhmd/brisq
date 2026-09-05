import { PostStatus, Prisma } from "../../generated/prisma/client";
import { parsePlatform, BadRequestError, NotFoundError } from "@brisq/common";
import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;

export function buildUpdatePlatformStatusService(
  postRepository: PostRepository,
) {
  return async (
    postId: string,
    platform: unknown,
    status: unknown,
    errorMessage: unknown,
  ) => {
    const parsedPlatform = parsePlatform(platform);

    if (status !== "SUCCEEDED" && status !== "FAILED") {
      throw new BadRequestError(`Invalid status: ${status}`);
    }

    const finalErrorMessage =
      status === "FAILED" ? ((errorMessage as string) ?? null) : null;

    try {
      return await postRepository.updatePlatformStatus(
        postId,
        parsedPlatform,
        status as PostStatus,
        finalErrorMessage,
      );
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === "P2025"
      ) {
        throw new NotFoundError("Post platform status not found");
      }
      throw err;
    }
  };
}
