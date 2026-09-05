import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "@brisq/common";
import { buildPostRouter } from "./routes/post.routes";
import {
  publishController,
  updatePlatformStatusController,
} from "./config/container";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(
  "/posts",
  buildPostRouter({ publishController, updatePlatformStatusController }),
);

app.use(errorHandler);

export default app;
