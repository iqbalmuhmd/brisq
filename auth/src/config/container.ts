import prisma from "./db";
import { buildUserRepository } from "../repositories/auth/user.repository";
import { buildRegisterService } from "../services/auth/register.service";
import { buildRegisterController } from "../controllers/auth/register.controller";
import { buildTokenService } from "../services/auth/token.service";
import { buildLoginService } from "../services/auth/login.service";
import { buildLoginController } from "../controllers/auth/login.controller";
import { config } from "./env";

const userRepository = buildUserRepository(prisma);
const tokenService = buildTokenService(config.jwt.secret);

const registerService = buildRegisterService(userRepository);
const loginService = buildLoginService(userRepository, tokenService);

export const registerController = buildRegisterController(registerService);
export const loginController = buildLoginController(loginService);
