import { Platform, IJobPayload } from "@brisq/common";
import { buildAuthClient } from "../clients/auth.client";
import { buildLinkedInClient } from "../clients/linkedin.client";
import { buildPostClient } from "../clients/post.client";
import { buildLinkedInHandler } from "../handlers/linkedin.handler";

type JobHandler = (job: IJobPayload) => Promise<void>;

const authClient = buildAuthClient();
const linkedInClient = buildLinkedInClient();
const postClient = buildPostClient();

const linkedInHandler = buildLinkedInHandler(
  authClient,
  linkedInClient,
  postClient,
);

export const handlers: Record<Platform, JobHandler> = {
  [Platform.LINKEDIN]: linkedInHandler,
};
