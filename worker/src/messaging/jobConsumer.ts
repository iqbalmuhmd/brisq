import { ConfirmChannel, ConsumeMessage } from "amqplib";
import { parseJobPayload } from "../entities/JobEntity";
import { StatusSyncError, UnknownOutcomeError } from "../errors";
import { Platform, IJobPayload, IStatusUpdate } from "@brisq/common";
import { buildPostClient } from "../clients/post.client";
import { decideProcessing } from "./jobStatusDecision";

type JobHandler = (job: IJobPayload) => Promise<void>;
type PublishStatusUpdate = (update: IStatusUpdate) => Promise<void>;
type PostClient = ReturnType<typeof buildPostClient>;

export function buildJobConsumer(
  handlers: Record<Platform, JobHandler>,
  publishStatusUpdate: PublishStatusUpdate,
  getChannel: () => ConfirmChannel,
  postClient: PostClient,
) {
  let currentConsumerTag: string | undefined;
  let inFlight: Promise<void> | undefined;

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

    let statusResult;
    try {
      statusResult = await postClient.getStatus(job.postId, job.platform);
    } catch (err) {
      console.error("Post status check failed:", {
        jobId: job.jobId,
        postId: job.postId,
        userId: job.userId,
        platform: job.platform,
        message: err instanceof Error ? err.message : String(err),
      });

      try {
        await publishStatusUpdate({
          postId: job.postId,
          platform: job.platform,
          status: "FAILED",
          errorCode: "STATUS_CHECK_FAILED",
          errorMessage:
            "Could not verify the post's current status before processing.",
        });
      } catch (err) {
        console.error("Failed to publish failure status:", err);
      }
      channel.nack(msg, false, false);
      return;
    }

    const processingDecision = decideProcessing(
      statusResult.status,
      msg.fields.redelivered,
    );

    if (processingDecision === "SKIP") {
      console.log("Skipping already-resolved job:", {
        jobId: job.jobId,
        postId: job.postId,
        status: statusResult.status,
      });
      channel.ack(msg);
      return;
    }

    if (processingDecision === "ABANDON") {
      console.error("Job abandoned after redelivery with unresolved status:", {
        jobId: job.jobId,
        postId: job.postId,
        userId: job.userId,
        platform: job.platform,
      });

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

  async function start() {
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

  function getConsumerTag() {
    return currentConsumerTag;
  }

  function getInFlight() {
    return inFlight;
  }

  return { start, getConsumerTag, getInFlight };
}
