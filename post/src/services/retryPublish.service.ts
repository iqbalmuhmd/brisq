import { randomUUID } from "crypto";
import { IJobPayload, parsePlatform, NotFoundError } from "@brisq/common";
import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;
type PublishJob = (payload: IJobPayload) => Promise<void>;

export function buildRetryPublishService(
  postRepository: PostRepository,
  publishJob: PublishJob,
) {
  return async (postId: string, platform: unknown, userId: string) => {
    const parsedPlatform = parsePlatform(platform);

    const { count } = await postRepository.retryPlatformStatus(
      postId,
      parsedPlatform,
      userId,
    );

    if (count === 0) {
      throw new NotFoundError("Post is not retryable");
    }

    const post = await postRepository.findByIdForUser(postId, userId);

    await publishJob({
      jobId: randomUUID(),
      postId: post!.id,
      userId,
      platform: parsedPlatform,
      content: post!.content,
      imageUrl: post!.imageUrl ?? undefined,
    });
  };
}
