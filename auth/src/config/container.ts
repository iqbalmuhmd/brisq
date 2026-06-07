import prisma from "./db";
import { buildUserRepository } from "../repositories/auth/user.repository";
import { buildRegisterService } from "../services/auth/register.service";
import { buildRegisterController } from "../controllers/auth/register.controller";
import { buildTokenService } from "../services/auth/token.service";
import { buildLoginService } from "../services/auth/login.service";
import { buildLoginController } from "../controllers/auth/login.controller";
import { config } from "./env";
import { buildLogger } from "@brisq/common";

const userRepository = buildUserRepository(prisma);
const tokenService = buildTokenService(config.jwt.secret);

const registerService = buildRegisterService(userRepository);
const loginService = buildLoginService(userRepository, tokenService);

const logger = buildLogger("auth-service");

export const registerController = buildRegisterController(
  registerService,
  logger,
);
export const loginController = buildLoginController(loginService, logger);

export { logger };
