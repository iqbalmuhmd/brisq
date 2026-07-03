import { Request, Response } from "express";
import { buildLinkedInService } from "../../services/oauth/linkedin.service";
import { ApiResponse, ForbiddenError } from "@brisq/common";

type LinkedInService = ReturnType<typeof buildLinkedInService>;

export function buildLinkedInCallbackController(
  linkedInService: LinkedInService,
) {
  return async (req: Request, res: Response) => {
    const { code, state, error } = req.query as Record<string, string>;

    if (error === "access_denied") {
      return res.status(200).json(
        new ApiResponse(true, "LinkedIn connection cancelled", {
          status: "cancelled",
        }),
      );
    }

    const storedState = req.cookies.state;

    if (!storedState || state !== storedState) {
      throw new ForbiddenError("Invalid state parameter");
    }

    res.clearCookie("state");

    await linkedInService.handleCallback(code, req.user!.userId);

    res.status(200).json(
      new ApiResponse(true, "LinkedIn connected", {
        status: "connected",
      }),
    );
  };
}
