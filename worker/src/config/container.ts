import { Platform, IJobPayload, getChannel } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildLinkedInClient } from "../clients/linkedin.client";
import { publishStatusUpdate } from "../messaging/statusPublisher";
import { buildLinkedInHandler } from "../handlers/linkedin.handler";
import { buildJobConsumer } from "../messaging/jobConsumer";

type JobHandler = (job: IJobPayload) => Promise<void>;

const authClient = buildAuthClient();
const linkedInClient = buildLinkedInClient();

const linkedInHandler = buildLinkedInHandler(
  authClient,
  linkedInClient,
  publishStatusUpdate,
);

export const handlers: Record<Platform, JobHandler> = {
  [Platform.LINKEDIN]: linkedInHandler,
};

export const jobConsumer = buildJobConsumer(
  handlers,
  publishStatusUpdate,
  getChannel,
);
