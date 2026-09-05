import { randomUUID } from "crypto";
import { IJobPayload } from "@brisq/common";
import { PostEntity } from "../entities/PostEntity";
import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;
type PublishJob = (payload: IJobPayload) => void;

export function buildPublishService(
  postRepository: PostRepository,
  publishJob: PublishJob,
) {
  return async (
    userId: string,
    content: unknown,
    platforms: unknown,
    imageUrl?: unknown,
  ) => {
    const postEntity = new PostEntity(content, platforms, imageUrl);

    const post = await postRepository.create(
      userId,
      postEntity.content,
      postEntity.imageUrl ?? null,
      postEntity.toPlatformStatuses(),
    );

    for (const platform of postEntity.platforms) {
      publishJob({
        jobId: randomUUID(),
        postId: post.id,
        userId,
        platform,
        content: postEntity.content,
        imageUrl: postEntity.imageUrl,
      });
    }

    return post;
  };
}
