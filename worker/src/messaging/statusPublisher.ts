import { publishWithConfirm, IStatusUpdate } from "@brisq/common";

export function publishStatusUpdate(update: IStatusUpdate): Promise<void> {
  return publishWithConfirm("post_status_updates", update);
}