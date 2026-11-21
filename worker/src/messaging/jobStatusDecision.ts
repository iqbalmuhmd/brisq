import type { PostStatusResult } from "../clients/post.client";

export type ProcessingDecision = "PROCEED" | "ABANDON" | "SKIP";

/**
 * Decide whether a publish job should be processed.
 *
 * - Resolved status → SKIP.
 * - PENDING + redelivered → ABANDON to avoid retrying a job whose
 *   previous attempt may have already reached the platform.
 * - PENDING + first delivery → PROCEED.
 *
 * The redelivery check protects against duplicate external publishes
 * when the worker crashes before acknowledging the RabbitMQ message.
 */

export function decideProcessing(
  status: PostStatusResult["status"],
  redelivered: boolean,
): ProcessingDecision {
  if (status !== "PENDING") return "SKIP";
  return redelivered ? "ABANDON" : "PROCEED";
}
