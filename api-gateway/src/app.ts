import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "@brisq/common";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

app.use(errorHandler);

export default app;