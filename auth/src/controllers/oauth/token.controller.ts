import { Request, Response } from "express";
import { buildLinkedInService } from "../../services/oauth/linkedin.service";
import { ApiResponse, Logger, Platform } from "@brisq/common";

type LinkedInService = ReturnType<typeof buildLinkedInService>;

export function buildTokenController(
  linkedInService: LinkedInService,
  logger: Logger,
) {
  return async (req: Request, res: Response) => {
    const { platform } = req.params;
    const userId = req.headers["x-user-id"] as string;

    const accessToken = await linkedInService.getValidToken(
      userId,
      platform as Platform,
    );

    logger.info("Token retrieved for worker", { userId, platform });

    res
      .status(200)
      .json(
        new ApiResponse(true, "Token retrieved", { accessToken, platform }),
      );
  };
}
