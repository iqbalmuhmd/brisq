import prisma from "./db";
import { buildPostRepository } from "../repositories/post/post.repository";
import { buildPublishService } from "../services/publish.service";
import { buildPublishController } from "../controllers/publish.controller";
import { jobPublisher } from "../messaging/jobPublisher";

const postRepository = buildPostRepository(prisma);
const publishService = buildPublishService(postRepository, jobPublisher);

export const publishController = buildPublishController(publishService);
