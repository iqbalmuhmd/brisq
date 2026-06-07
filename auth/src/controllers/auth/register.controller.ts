import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildRegisterService } from "../../services/auth/register.service";
import { Logger } from "@brisq/common";

type RegisterService = ReturnType<typeof buildRegisterService>;

export function buildRegisterController(
  registerService: RegisterService,
  logger: Logger,
) {
  return async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await registerService(email, password);
    logger.info('User registered', { userId: user.userId, email: user.email });
    res.status(201).json(new ApiResponse(true, "User registered", user));
  };
}
