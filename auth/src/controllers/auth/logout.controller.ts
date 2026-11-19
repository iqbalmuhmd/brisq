import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { TOKEN_COOKIE_NAME, tokenCookieOptions } from "../../config/cookie";

export function logoutController(_req: Request, res: Response) {
  res.clearCookie(TOKEN_COOKIE_NAME, tokenCookieOptions);
  res.status(200).json(new ApiResponse(true, "Logged out"));
}
