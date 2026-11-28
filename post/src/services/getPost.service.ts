import { NotFoundError } from "@brisq/common";
import { buildPostRepository } from "../repositories/post/post.repository";
import { buildImageSigner } from "../storage/imageSigner";

type PostRepository = ReturnType<typeof buildPostRepository>;
type ImageSigner = ReturnType<typeof buildImageSigner>;

export function buildGetPostService(
  postRepository: PostRepository,
  imageSigner: ImageSigner,
) {
  return async (postId: string, userId: string) => {
    const post = await postRepository.findByIdForUser(postId, userId);
    if (!post) {
      throw new NotFoundError("Post not found");
    }
    const imageUrl = post.imageKey
      ? await imageSigner.signImageUrl(post.imageKey)
      : null;
    return { ...post, imageUrl };
  };
}
