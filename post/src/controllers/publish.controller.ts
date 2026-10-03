import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildPublishService } from "../services/publish.service";

type PublishService = ReturnType<typeof buildPublishService>;

export function buildPublishController(publishService: PublishService) {
  return async (req: Request, res: Response) => {
    const { content, platforms, imageUrl } = req.body;
    const userId = req.user!.userId;

    const post = await publishService(userId, content, platforms, imageUrl);

    res
      .status(201)
      .json(new ApiResponse(true, "Post queued for publishing", post));
  };
}
