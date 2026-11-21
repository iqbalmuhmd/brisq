import { z } from "zod";
import { Platform } from "./Platform";

export const jobResultEventSchema = z.object({
  eventId: z.string().uuid(),
  postId: z.string(),
  userId: z.string(),
  platform: z.nativeEnum(Platform),
  status: z.enum(["SUCCEEDED", "FAILED"]),
  errorCode: z.string().nullable(),
  timestamp: z.string().datetime(),
});

export type IJobResultEvent = z.infer<typeof jobResultEventSchema>;
