import { z } from "zod";
import { IJobPayload, Platform } from "@brisq/common";

const jobSchema = z.object({
  jobId: z.string(),
  postId: z.string(),
  userId: z.string(),
  platform: z.nativeEnum(Platform),
  content: z.string(),
  imageKey: z.string().optional(),
});

export function parseJobPayload(raw: unknown): IJobPayload {
  const result = jobSchema.safeParse(raw);
  if (!result.success) {
    throw new Error(result.error.issues[0].message);
  }
  return result.data;
}
