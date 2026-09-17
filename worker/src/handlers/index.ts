import { IJobPayload, Platform } from "@brisq/common";

type JobHandler = (job: IJobPayload) => Promise<void>;

export const handlers: Record<Platform, JobHandler> = {
  [Platform.LINKEDIN]: async (job) => {
    console.log("LinkedIn stub handling job:", job.jobId);
  },
};
