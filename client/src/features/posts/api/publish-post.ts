import { apiFetch } from "@/lib/api";
import type { Post, PublishPostInput } from "@/types/api";
import { useMutation } from "@tanstack/react-query";

export function publishPost(input: PublishPostInput): Promise<Post> {
  return apiFetch<Post>("/posts/publish", {
    method: "POST",
    body: input,
  });
}

export function usePublishPost() {
  return useMutation({ mutationFn: publishPost });
}
