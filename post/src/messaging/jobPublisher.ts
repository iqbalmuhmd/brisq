import { getChannel, IJobPayload } from "@brisq/common";

export function jobPublisher(payload: IJobPayload): void {
  getChannel().sendToQueue(
    "publish_jobs",
    Buffer.from(JSON.stringify(payload)),
    { persistent: true },
  );
}
