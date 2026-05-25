import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
import { loadEnv } from "@brisq/common";

loadEnv(["PORT", "AUTH_SERVICE_URL", "JWT_SECRET"]);

export const config = {
  port: Number(process.env.PORT) || 3000,
  auth_service: {
    url: process.env.AUTH_SERVICE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
} as const;
