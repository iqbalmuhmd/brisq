import { getChannel, statusUpdateSchema } from "@brisq/common";
import { ConsumeMessage } from "amqplib";
import { buildUpdatePlatformStatusService } from "../services/updatePlatformStatus.service";

type UpdatePlatformStatusService = ReturnType<
  typeof buildUpdatePlatformStatusService
>;

export function buildStatusConsumer(
  updatePlatformStatusService: UpdatePlatformStatusService,
) {
  let currentConsumerTag: string | undefined;
  let inFlight: Promise<void> | undefined;

  async function handleMessage(msg: ConsumeMessage | null) {
    if (!msg) return;

    const channel = getChannel();

    let raw: unknown;
    try {
      raw = JSON.parse(msg.content.toString());
    } catch (err) {
      console.error("Invalid JSON on status update queue:", err);
      channel.ack(msg);
      return;
    }

    const result = statusUpdateSchema.safeParse(raw);
    if (!result.success) {
      console.error(
        "Status update failed schema validation:",
        result.error.issues,
      );
      channel.ack(msg);
      return;
    }

    const update = result.data;
    const errorCode = update.status === "FAILED" ? update.errorCode : null;
    const errorMessage =
      update.status === "FAILED" ? update.errorMessage : null;

    try {
      const dbResult = await updatePlatformStatusService(
        update.postId,
        update.platform,
        update.status,
        errorMessage,
        errorCode,
      );

      if (dbResult.count === 0) {
        console.log(
          "Status update matched no row (already applied or missing), acking:",
          update,
        );
      }

      channel.ack(msg);
    } catch (err) {
      console.error("DB error applying status update, will retry:", err);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      channel.nack(msg, false, true);
    }
  }

  async function start() {
    const channel = getChannel();
    channel.prefetch(1);

    const { consumerTag } = await channel.consume(
      "post_status_updates",
      (msg) => {
        inFlight = handleMessage(msg).catch((err) => {
          console.error("Unhandled error in status handleMessage:", err);
        });
      },
      { noAck: false },
    );

    currentConsumerTag = consumerTag;
  }

  function getConsumerTag() {
    return currentConsumerTag;
  }

  function getInFlight() {
    return inFlight;
  }

  return { start, getConsumerTag, getInFlight };
}
