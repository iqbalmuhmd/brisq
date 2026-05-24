import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
import { loadEnv } from "@brisq/common";

loadEnv(["PORT", "AUTH_SERVICE_URL"]);

export const config = {
  port: Number(process.env.PORT) || 3000,
  auth_service_url: process.env.AUTH_SERVICE_URL,
} as const;
