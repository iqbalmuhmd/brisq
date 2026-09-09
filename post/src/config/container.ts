import prisma from "./db";
import { buildPostRepository } from "../repositories/post/post.repository";
import { buildPublishService } from "../services/publish.service";
import { buildPublishController } from "../controllers/publish.controller";
import { jobPublisher } from "../messaging/jobPublisher";
import { buildUpdatePlatformStatusService } from "../services/updatePlatformStatus.service";
import { buildUpdatePlatformStatusController } from "../controllers/updatePlatformStatus.controller";
import { buildGetPostsService } from "../services/getPosts.service";
import { buildGetPostsController } from "../controllers/getPosts.controller";

const postRepository = buildPostRepository(prisma);

const publishService = buildPublishService(postRepository, jobPublisher);
const updatePlatformStatusService =
  buildUpdatePlatformStatusService(postRepository);
const getPostsService = buildGetPostsService(postRepository);

export const publishController = buildPublishController(publishService);
export const updatePlatformStatusController =
  buildUpdatePlatformStatusController(updatePlatformStatusService);
export const getPostsController = buildGetPostsController(getPostsService);
