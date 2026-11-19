import { Request, Response } from "express";
import { buildLoginService } from "../../services/auth/login.service";
import { ApiResponse } from "@brisq/common";
import { Logger } from "@brisq/common";
import {
  TOKEN_COOKIE_MAX_AGE,
  TOKEN_COOKIE_NAME,
  tokenCookieOptions,
} from "../../config/cookie";

type LoginService = ReturnType<typeof buildLoginService>;

export function buildLoginController(
  loginService: LoginService,
  logger: Logger,
) {
  return async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await loginService(email, password);

    res.cookie(TOKEN_COOKIE_NAME, user.token, {
      ...tokenCookieOptions,
      maxAge: TOKEN_COOKIE_MAX_AGE,
    });

    logger.info("User logged in", { userId: user.userId, email: user.email });

    res.status(200).json(
      new ApiResponse(true, "Login successful", {
        userId: user.userId,
        email: user.email,
      }),
    );
  };
}
