import prisma from "./db";
import { buildUserRepository } from "../repositories/auth/user.repository";
import { buildRegisterService } from "../services/auth/register.service";
import { buildRegisterController } from "../controllers/auth/register.controller";
import { buildTokenService } from "../services/auth/token.service";
import { buildLoginService } from "../services/auth/login.service";
import { buildLoginController } from "../controllers/auth/login.controller";
import { buildLinkedInService } from "../services/oauth/linkedin.service";
import { buildLinkedInController } from "../controllers/oauth/linkedin.controller";
import { buildTokenRepository } from "../repositories/token/token.repository";
import { buildLinkedInCallbackController } from "../controllers/oauth/linkedin.callback.controller";
import { buildTokenController } from "../controllers/oauth/token.controller";
import { buildLinkedInStatusController } from "../controllers/oauth/linkedin.status.controller";
import { config } from "./env";
import { buildLogger } from "@brisq/common";

const userRepository = buildUserRepository(prisma);
const tokenService = buildTokenService(config.jwt.secret);
const tokenRepository = buildTokenRepository(prisma);

const registerService = buildRegisterService(userRepository);
const loginService = buildLoginService(userRepository, tokenService);
const linkedInService = buildLinkedInService(config.linkedin, tokenRepository);

const logger = buildLogger("auth-service");

export const registerController = buildRegisterController(
  registerService,
  logger,
);
export const loginController = buildLoginController(loginService, logger);
export const linkedInController = buildLinkedInController(
  linkedInService,
  logger,
);
export const linkedInCallbackController =
  buildLinkedInCallbackController(linkedInService);

export const tokenController = buildTokenController(linkedInService, logger);
export const linkedinStatusController = buildLinkedInStatusController(
  linkedInService,
  logger,
);

export { logger };
