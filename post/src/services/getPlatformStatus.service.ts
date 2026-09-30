import { NotFoundError, parsePlatform } from "@brisq/common";
import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;

export function buildGetPlatformStatusService(postRepository: PostRepository) {
  return async (postId: string, platform: unknown) => {
    const parsedPlatform = parsePlatform(platform)
    const platformStatus = await postRepository.getPlatformStatus(
      postId,
      parsedPlatform,
    );
    if (!platformStatus) {
      throw new NotFoundError("PlatformStatus not found");
    }
    return {
      status: platformStatus.status,
      errorCode: platformStatus.errorCode,
    };
  };
}
