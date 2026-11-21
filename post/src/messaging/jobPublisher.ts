import { publishWithConfirm, IJobPayload } from "@brisq/common";

export function publishJob(payload: IJobPayload): Promise<void> {
  return publishWithConfirm("publish_jobs", payload);
}
