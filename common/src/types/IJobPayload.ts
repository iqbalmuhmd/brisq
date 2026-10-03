import { Platform } from "./Platform";

export interface IJobPayload {
  jobId: string;
  postId: string;
  userId: string;
  platform: Platform;
  content: string;
  imageUrl?: string;
}