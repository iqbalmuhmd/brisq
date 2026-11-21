import express from "express";
import { errorHandler } from "@brisq/common";
import { buildAssetRouter } from "./routes/asset.routes";
import { uploadAssetController } from "./config/container";

const app = express();

app.use("/assets", buildAssetRouter({ uploadAssetController }));

app.use(errorHandler);

export default app;
