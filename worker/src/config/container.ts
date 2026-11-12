import { Platform, IJobPayload, getChannel } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildLinkedInClient } from "../clients/linkedin.client";
import { publishStatusUpdate } from "../messaging/statusPublisher";
import { buildLinkedInHandler } from "../handlers/linkedin.handler";
import { buildJobConsumer } from "../messaging/jobConsumer";
import { buildPostClient } from "../clients/post.client";
import { buildS3Client } from "../clients/s3.client";
import { s3Client } from "./s3";
import { config } from "./env";

type JobHandler = (job: IJobPayload) => Promise<void>;

const authClient = buildAuthClient();
const linkedInClient = buildLinkedInClient();
const postClient = buildPostClient();
const imageStore = buildS3Client(s3Client, config.aws.bucket);

const linkedInHandler = buildLinkedInHandler(
  authClient,
  linkedInClient,
  imageStore,
  publishStatusUpdate,
);

export const handlers: Record<Platform, JobHandler> = {
  [Platform.LINKEDIN]: linkedInHandler,
};

export const jobConsumer = buildJobConsumer(
  handlers,
  publishStatusUpdate,
  getChannel,
  postClient,
);
