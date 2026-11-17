export type Platform = "LINKEDIN";

export type PostStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export type PostPlatformStatus = {
  id: string;
  postId: string;
  platform: Platform;
  status: PostStatus;
  errorCode: string | null;
  errorMessage: string | null;
  updatedAt: string;
};

export type Post = {
  id: string;
  userId: string;
  content: string;
  imageKey: string | null;
  createdAt: string;
  platformStatuses: PostPlatformStatus[];
};

export type User = {
  userId: string;
  email: string;
};

export type LinkedInStatus = {
  connected: boolean;
  expiresAt?: string;
};

export type UploadResult = {
  key: string;
};
