import prisma from "./db";
import { buildPostRepository } from "../repositories/post/post.repository";
import { buildPublishService } from "../services/publish.service";
import { buildPublishController } from "../controllers/publish.controller";
import { jobPublisher } from "../messaging/jobPublisher";
import { buildUpdatePlatformStatusService } from "../services/updatePlatformStatus.service";
import { buildGetPostsService } from "../services/getPosts.service";
import { buildGetPostsController } from "../controllers/getPosts.controller";
import { buildGetPostService } from "../services/getPost.service";
import { buildGetPostController } from "../controllers/getPost.controller";
import { buildRetryPublishService } from "../services/retryPublish.service";
import { buildRetryPublishController } from "../controllers/retryPublish.controller";
import { buildStatusConsumer } from "../messaging/statusConsumer";

const postRepository = buildPostRepository(prisma);

const publishService = buildPublishService(postRepository, jobPublisher);
const updatePlatformStatusService =
  buildUpdatePlatformStatusService(postRepository);
const getPostsService = buildGetPostsService(postRepository);
const getPostService = buildGetPostService(postRepository);
const retryPublishService = buildRetryPublishService(
  postRepository,
  jobPublisher,
);

export const statusConsumer = buildStatusConsumer(updatePlatformStatusService);

export const publishController = buildPublishController(publishService);
export const getPostsController = buildGetPostsController(getPostsService);
export const getPostController = buildGetPostController(getPostService);
export const retryPublishController =
  buildRetryPublishController(retryPublishService);
