import { buildPostRepository } from "../repositories/post/post.repository";

type PostRepository = ReturnType<typeof buildPostRepository>;

export function buildGetPostsService(postRepository: PostRepository) {
  return async (userId: string) => {
    return postRepository.findManyByUser(userId);
  };
}
