import dotenv from "dotenv";

const envFile =
  process.env.NODE_ENV === "test" ? ".env.test" : ".env.development";

dotenv.config({ path: envFile });

import { loadEnv } from "@brisq/common";

loadEnv(["DATABASE_URL", "PORT", "INTER_SERVICE_SECRET"]);

export const config = {
  port: Number(process.env.PORT) || 3002,
  db: {
    url: process.env.DATABASE_URL!,
  },
} as const;
