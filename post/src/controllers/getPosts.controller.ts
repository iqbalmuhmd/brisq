import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildGetPostsService } from "../services/getPosts.service";

type GetPostsService = ReturnType<typeof buildGetPostsService>;

export function buildGetPostsController(getPostsService: GetPostsService) {
  return async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const posts = await getPostsService(userId);
    res.status(200).json(new ApiResponse(true, "Posts fetched", posts));
  };
}
