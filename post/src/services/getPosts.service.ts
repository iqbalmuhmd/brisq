import { buildPostRepository } from "../repositories/post/post.repository";
import { buildImageSigner } from "../storage/imageSigner";

type PostRepository = ReturnType<typeof buildPostRepository>;
type ImageSigner = ReturnType<typeof buildImageSigner>;

export function buildGetPostsService(
  postRepository: PostRepository,
  imageSigner: ImageSigner,
) {
  return async (userId: string) => {
    const posts = await postRepository.findManyByUser(userId);

    return Promise.all(
      posts.map(async (post) => {
        const imageUrl = post.imageKey
          ? await imageSigner.signImageUrl(post.imageKey)
          : null;
        return { ...post, imageUrl };
      }),
    );
  };
}
