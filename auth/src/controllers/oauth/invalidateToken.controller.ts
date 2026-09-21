import { Request, Response } from "express";
import { buildLinkedInService } from "../../services/oauth/linkedin.service";
import {
  ApiResponse,
  BadRequestError,
  Logger,
  parsePlatform,
} from "@brisq/common";

type LinkedInService = ReturnType<typeof buildLinkedInService>;

export function buildInvalidateTokenController(
  linkedInService: LinkedInService,
  logger: Logger,
) {
  return async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const platform = parsePlatform(req.params.platform);
    const accessToken = req.body?.accessToken;

    if (typeof accessToken !== "string" || accessToken.trim().length === 0) {
      throw new BadRequestError("accessToken must be a non-empty string");
    }

    await linkedInService.invalidateToken(userId, platform, accessToken);

    logger.info("Token invalidated", { userId, platform });

    res.status(200).json(new ApiResponse(true, "Token invalidated"));
  };
}
