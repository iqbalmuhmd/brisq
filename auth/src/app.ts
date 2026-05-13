import express from "express";
import { errorHandler } from "@brisq/common";

const app = express();

app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", service: "auth-service" });
});

app.use(errorHandler);

export default app;
