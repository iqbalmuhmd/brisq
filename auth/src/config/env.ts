import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
import { loadEnv } from "@brisq/common";

loadEnv(["DATABASE_URL", "PORT"]);

export const config = {
  port: Number(process.env.PORT) || 3001,
  db: {
    url: process.env.DATABASE_URL!,
  },
} as const;

