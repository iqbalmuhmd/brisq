import { NotFoundError } from "@brisq/common";
import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;

export function buildGetPostService(postRepository: PostRepository) {
  return async (postId: string, userId: string) => {
    const post = await postRepository.findByIdForUser(postId, userId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    return post;
  };
}
