import express from "express";
import { errorHandler } from "@brisq/common";
import { buildAuthRouter } from "./routes/auth/auth.routes";
import { registerController } from "./config/container";

const app = express();

app.use(express.json());

const authRouter = buildAuthRouter({ registerController });
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
