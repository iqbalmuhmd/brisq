import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildGetPostService } from "../services/getPost.service";

type GetPostService = ReturnType<typeof buildGetPostService>;

export function buildGetPostController(getPostService: GetPostService) {
  return async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const userId = req.user!.userId;
    const post = await getPostService(postId, userId);
    res.status(200).json(new ApiResponse(true, "Post fetched", post));
  };
}
