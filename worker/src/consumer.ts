import { getChannel } from "@brisq/common";
import { ConsumeMessage } from "amqplib";
import { handlers } from "./config/container";
import { parseJobPayload } from "./entities/JobEntity";
import { StatusSyncError, UnknownOutcomeError } from "./errors";
import { publishStatusUpdate } from "./messaging/statusPublisher";

async function handleMessage(msg: ConsumeMessage | null) {
  if (!msg) return;

  const channel = getChannel();

  let job;
  try {
    job = parseJobPayload(JSON.parse(msg.content.toString()));
  } catch (err) {
    console.error("Job Parsing failed:", err);
    channel.nack(msg, false, false);
    return;
  }
  try {
    await handlers[job.platform](job);
  } catch (err) {
    if (err instanceof StatusSyncError) {
      console.error("Status sync failed:", {
        jobId: job.jobId,
        postId: job.postId,
        userId: job.userId,
        platform: job.platform,
        message: err.message,
        cause:
          err.cause instanceof Error
            ? { name: err.cause.name, message: err.cause.message }
            : err.cause,
      });
      channel.ack(msg);
      return;
    }

    if (err instanceof UnknownOutcomeError) {
      try {
        await publishStatusUpdate({
          postId: job.postId,
          platform: job.platform,
          status: "FAILED",
          errorCode: "UNKNOWN_OUTCOME",
          errorMessage: "The outcome of the LinkedIn post is unknown.",
        });
      } catch (err) {
        console.error("Failed to publish failure status:", err);
      }
    } else {
      try {
        await publishStatusUpdate({
          postId: job.postId,
          platform: job.platform,
          status: "FAILED",
          errorCode: "PUBLISH_FAILED",
          errorMessage: "Failed to publish the post.",
        });
      } catch (err) {
        console.error("Failed to publish failure status:", err);
      }
    }
    console.error("Job failed:", {
      jobId: job.jobId,
      postId: job.postId,
      userId: job.userId,
      platform: job.platform,
      message: err instanceof Error ? err.message : String(err),
      cause:
        err instanceof UnknownOutcomeError && err.cause instanceof Error
          ? { name: err.cause.name, message: err.cause.message }
          : err instanceof UnknownOutcomeError
            ? err.cause
            : undefined,
    });

    channel.nack(msg, false, false);
    return;
  }

  channel.ack(msg);
}

let currentConsumerTag: string | undefined;
let inFlight: Promise<void> | undefined;

export async function startConsuming() {
  const channel = getChannel();
  channel.prefetch(1);

  const { consumerTag } = await channel.consume(
    "publish_jobs",
    (msg) => {
      inFlight = handleMessage(msg).catch((err) => {
        console.error("Unhandled error in handleMessage:", err);
      });
    },
    { noAck: false },
  );

  currentConsumerTag = consumerTag;
}

export function getConsumerTag() {
  return currentConsumerTag;
}

export function getInFlight() {
  return inFlight;
}
