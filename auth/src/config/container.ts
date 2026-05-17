import prisma from "./db";
import { buildUserRepository } from "../repositories/auth/user.repository";
import { buildRegisterService } from "../services/auth/register.service";
import { buildRegisterController } from "../controllers/auth/register.controller";

const userRepository = buildUserRepository(prisma);

const registerService = buildRegisterService(userRepository);

export const registerController = buildRegisterController(registerService);
