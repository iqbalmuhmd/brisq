import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.test" : ".env.development";

dotenv.config({ path: envFile });

import { loadEnv } from "@brisq/common";

loadEnv([
  "PORT",
  "INTER_SERVICE_SECRET",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET",
  "AWS_REGION",
]);

export const config = {
  port: Number(process.env.PORT) || 3003,
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    bucket: process.env.AWS_S3_BUCKET!,
    region: process.env.AWS_REGION!,
  },
} as const;
