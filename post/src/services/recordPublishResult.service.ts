import { PostStatus } from "../../generated/prisma/client";
import { parsePlatform, BadRequestError, IJobResultEvent } from "@brisq/common";
import { buildPostRepository } from "../repositories/post/post.repository";
import { randomUUID } from "node:crypto";

type PostRepository = ReturnType<typeof buildPostRepository>;
type PublishJobResult = (event: IJobResultEvent) => Promise<void>;

export function buildRecordPublishResultService(
  postRepository: PostRepository,
  publishJobResult: PublishJobResult,
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

    const result = await postRepository.updatePlatformStatus(
      postId,
      parsedPlatform,
      status as PostStatus,
      finalErrorMessage,
      finalErrorCode,
    );

    if (result.count === 0) {
      return result;
    }
    const owner = await postRepository.findPostOwner(postId);

    if (!owner) {
      console.error("Post owner not found for event publish:", { postId });
      return result;
    }

    const event: IJobResultEvent = {
      eventId: randomUUID(),
      postId,
      userId: owner.userId,
      platform: parsedPlatform,
      status,
      errorCode: finalErrorCode,
      timestamp: new Date().toISOString(),
    };

    try {
      await publishJobResult(event);
    } catch (err) {
      console.error("Failed to publish job result event:", {
        postId,
        platform: parsedPlatform,
        eventId: event.eventId,
        message: err instanceof Error ? err.message : String(err),
      });
    }

    return result;
  };
}
