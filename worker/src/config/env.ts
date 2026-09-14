import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.test" : ".env.development";

dotenv.config({ path: envFile });

import { loadEnv } from "@brisq/common";

loadEnv([
  "RABBITMQ_URL",
  "AUTH_SERVICE_URL",
  "POST_SERVICE_URL",
  "INTER_SERVICE_SECRET",
]);

export const config = {
  rabbitmq: {
    url: process.env.RABBITMQ_URL!,
  },
  auth: {
    url: process.env.AUTH_SERVICE_URL!,
  },
  post: {
    url: process.env.POST_SERVICE_URL!,
  },
  interServiceSecret: process.env.INTER_SERVICE_SECRET!,
} as const;
