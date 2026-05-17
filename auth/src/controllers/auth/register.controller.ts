import { Request, Response } from "express";
import { ApiResponse } from "@brisq/common";
import { buildRegisterService } from "../../services/auth/register.service";

type RegisterService = ReturnType<typeof buildRegisterService>;

export function buildRegisterController(registerService: RegisterService) {
  return async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await registerService(email, password);
    res.status(201).json(new ApiResponse(true, "User registered", user));
  };
}
