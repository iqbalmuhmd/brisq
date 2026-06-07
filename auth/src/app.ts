import express from "express";
import cookieParser from "cookie-parser";
import { errorHandler } from "@brisq/common";
import { buildAuthRouter } from "./routes/auth/auth.routes";
import { registerController } from "./config/container";
import { loginController } from "./config/container";
import { buildMorganMiddleware } from "@brisq/common";
import { logger } from "./config/container";

const app = express();

app.use(buildMorganMiddleware(logger));
app.use(express.json());
app.use(cookieParser());

const authRouter = buildAuthRouter({ registerController, loginController });
app.use("/auth", authRouter);

app.use(errorHandler);

export default app;
