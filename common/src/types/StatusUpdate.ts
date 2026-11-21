import { z } from "zod";
import { Platform } from "./Platform";

export const statusUpdateSchema = z.discriminatedUnion("status", [
  z.object({
    postId: z.string(),
    platform: z.nativeEnum(Platform),
    status: z.literal("SUCCEEDED"),
  }),
  z.object({
    postId: z.string(),
    platform: z.nativeEnum(Platform),
    status: z.literal("FAILED"),
    errorCode: z.string().min(1),
    errorMessage: z.string().nullable(),
  }),
]);

export type IStatusUpdate = z.infer<typeof statusUpdateSchema>;
