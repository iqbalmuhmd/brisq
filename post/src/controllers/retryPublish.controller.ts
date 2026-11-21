import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildRetryPublishService } from "../services/retryPublish.service";

type RetryPublishService = ReturnType<typeof buildRetryPublishService>;

export function buildRetryPublishController(
  retryPublishService: RetryPublishService,
) {
  return async (req: Request, res: Response) => {
    const postId = req.params.postId as string;
    const platform = req.params.platform as string;
    const userId = req.user!.userId;

    const result = await retryPublishService(postId, platform, userId);

    res
      .status(200)
      .json(new ApiResponse(true, "Post queued for retry", result));
  };
}
