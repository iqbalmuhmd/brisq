import { Request, Response } from "express";
import { buildLinkedInService } from "../../services/oauth/linkedin.service";
import { ForbiddenError } from "@brisq/common";

type LinkedInService = ReturnType<typeof buildLinkedInService>;

export function buildLinkedInCallbackController(
  linkedInService: LinkedInService,
) {
  return async (req: Request, res: Response) => {
    try {
      const { code, state, error } = req.query as Record<string, string>;

      if (error === "access_denied") {
        return res.redirect(
          "http://localhost:3000/dashboard?error=connection_cancelled",
        );
      }

      const storedState = req.cookies.state;

      if (!storedState || state !== storedState) {
        throw new ForbiddenError("Invalid state parameter");
      }

      res.clearCookie("state");

      await linkedInService.handleCallback(code, req.user!.userId);

      res.redirect("http://localhost:3000/dashboard");
    } catch (err) {
      if (err instanceof ForbiddenError) {
        return res.redirect(
          "http://localhost:3000/dashboard?error=invalid_state",
        );
      }
      res.redirect("http://localhost:3000/dashboard?error=oauth_failed");
    }
  };
}
