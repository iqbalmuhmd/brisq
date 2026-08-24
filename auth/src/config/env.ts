import dotenv from "dotenv";
const envFile =
  process.env.NODE_ENV === "test" ? ".env.test" : ".env.development";
dotenv.config({ path: envFile });
import { loadEnv } from "@brisq/common";
loadEnv([
  "DATABASE_URL",
  "PORT",
  "JWT_SECRET",
  "INTER_SERVICE_SECRET",
  "LINKEDIN_CLIENT_ID",
  "LINKEDIN_CLIENT_SECRET",
  "LINKEDIN_REDIRECT_URI",
]);

export const config = {
  port: Number(process.env.PORT) || 3001,
  db: {
    url: process.env.DATABASE_URL!,
  },
  jwt: {
    secret: process.env.JWT_SECRET!,
  },
  linkedin: {
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirectUri: process.env.LINKEDIN_REDIRECT_URI!,
  },
} as const;
