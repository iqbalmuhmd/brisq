import express from "express";
import { errorHandler } from "@brisq/common";
import { buildPostRouter } from "./routes/post.routes";
import {
  publishController,
  updatePlatformStatusController,
  getPostsController,
  getPostController,
  retryPublishController,
} from "./config/container";

const app = express();

app.use(express.json());

app.use(
  "/posts",
  buildPostRouter({
    publishController,
    updatePlatformStatusController,
    getPostsController,
    getPostController,
    retryPublishController,
  }),
);

app.use(errorHandler);

export default app;
