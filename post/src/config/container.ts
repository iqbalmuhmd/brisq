import prisma from "./db";
import { buildPostRepository } from "../repositories/post/post.repository";
import { buildPublishService } from "../services/publish.service";
import { buildPublishController } from "../controllers/publish.controller";
import { publishJob } from "../messaging/jobPublisher";
import { publishJobResult } from "../messaging/jobResultPublisher";
import { buildRecordPublishResultService } from "../services/recordPublishResult.service";
import { buildGetPostsService } from "../services/getPosts.service";
import { buildGetPostsController } from "../controllers/getPosts.controller";
import { buildGetPostService } from "../services/getPost.service";
import { buildGetPostController } from "../controllers/getPost.controller";
import { buildRetryPublishService } from "../services/retryPublish.service";
import { buildRetryPublishController } from "../controllers/retryPublish.controller";
import { buildStatusConsumer } from "../messaging/statusConsumer";
import { buildGetPlatformStatusService } from "../services/getPlatformStatus.service";
import { buildGetPlatformStatusController } from "../controllers/getPlatformStatus.controller";

const postRepository = buildPostRepository(prisma);

const publishService = buildPublishService(postRepository, publishJob);
const recordPublishResultService =
  buildRecordPublishResultService(postRepository, publishJobResult);
const getPostsService = buildGetPostsService(postRepository);
const getPostService = buildGetPostService(postRepository);
const retryPublishService = buildRetryPublishService(
  postRepository,
  publishJob,
);
const getPlatformStatusService = buildGetPlatformStatusService(postRepository);

export const statusConsumer = buildStatusConsumer(recordPublishResultService);

export const publishController = buildPublishController(publishService);
export const getPostsController = buildGetPostsController(getPostsService);
export const getPostController = buildGetPostController(getPostService);
export const retryPublishController =
  buildRetryPublishController(retryPublishService);
export const getPlatformStatusController = buildGetPlatformStatusController(
  getPlatformStatusService,
);
