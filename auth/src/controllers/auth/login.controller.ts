import { Request, Response } from "express";
import { buildLoginService } from "../../services/auth/login.service";
import { ApiResponse } from "@brisq/common";

type LoginService = ReturnType<typeof buildLoginService>;

export function buildLoginController(loginService: LoginService) {
  return async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await loginService(email, password);

    res.cookie("token", user.token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    res.status(200).json(
      new ApiResponse(true, "Login successful", {
        userId: user.userId,
        email: user.email,
      }),
    );
  };
}
