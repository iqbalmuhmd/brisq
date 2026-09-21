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
    errorCode: unknown,
  ) => {
    const parsedPlatform = parsePlatform(platform);

    if (status !== "SUCCEEDED" && status !== "FAILED") {
      throw new BadRequestError(`Invalid status: ${status}`);
    }

    let finalErrorCode: string | null = null;
    if (status === "FAILED") {
      if (typeof errorCode !== "string" || errorCode.trim().length === 0) {
        throw new BadRequestError(
          "errorCode must be a non-empty string when status is FAILED",
        );
      }
      finalErrorCode = errorCode;
    }

    const finalErrorMessage =
      status === "FAILED" ? ((errorMessage as string) ?? null) : null;

    try {
      return await postRepository.updatePlatformStatus(
        postId,
        parsedPlatform,
        status as PostStatus,
        finalErrorMessage,
        finalErrorCode,
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
