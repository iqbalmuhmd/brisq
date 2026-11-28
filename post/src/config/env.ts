import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.test" : ".env.development";

dotenv.config({ path: envFile });

import { loadEnv } from "@brisq/common";

loadEnv([
  "DATABASE_URL",
  "PORT",
  "INTER_SERVICE_SECRET",
  "RABBITMQ_URL",
  "AWS_ACCESS_KEY_ID",
  "AWS_SECRET_ACCESS_KEY",
  "AWS_S3_BUCKET",
  "AWS_REGION",
]);

export const config = {
  port: Number(process.env.PORT) || 3002,
  db: {
    url: process.env.DATABASE_URL!,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL!,
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    bucket: process.env.AWS_S3_BUCKET!,
    region: process.env.AWS_REGION!,
  },
} as const;
