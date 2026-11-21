import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "@brisq/common";
import { buildAuthRouter } from "./routes/auth.routes";
import {
  registerController,
  loginController,
  linkedInController,
  linkedInCallbackController,
  tokenController,
  linkedinStatusController,
  invalidateTokenController,
} from "./config/container";
import { buildMorganMiddleware } from "@brisq/common";
import { logger } from "./config/container";

const app = express();

app.use(buildMorganMiddleware(logger));
app.use(express.json());
app.use(cookieParser());

const authRouter = buildAuthRouter({
  registerController,
  loginController,
  linkedInController,
  linkedInCallbackController,
  tokenController,
  linkedinStatusController,
  invalidateTokenController,
});
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
