import { publishToExchangeWithConfirm, IJobResultEvent } from "@brisq/common";

export function publishJobResult(event: IJobResultEvent): Promise<void> {
  return publishToExchangeWithConfirm("job_results", event);
}
