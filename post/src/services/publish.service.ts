import { randomUUID } from "crypto";
import { IJobPayload } from "@brisq/common";
import { PostEntity } from "../entities/PostEntity";
import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;
type PublishJob = (payload: IJobPayload) => Promise<void>;

export function buildPublishService(
  postRepository: PostRepository,
  publishJob: PublishJob,
) {
  return async (
    userId: string,
    content: unknown,
    platforms: unknown,
    imageKey?: unknown,
  ) => {
    const postEntity = new PostEntity(userId, content, platforms, imageKey);

    const post = await postRepository.create(
      userId,
      postEntity.content,
      postEntity.imageKey ?? null,
      postEntity.toPlatformStatuses(),
    );

    for (const platform of postEntity.platforms) {
      await publishJob({
        jobId: randomUUID(),
        postId: post.id,
        userId,
        platform,
        content: postEntity.content,
        imageKey: postEntity.imageKey,
      });
    }

    return post;
  };
}
