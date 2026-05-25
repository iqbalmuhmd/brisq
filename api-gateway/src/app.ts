import express from "express";
import cookieParser from "cookie-parser";
import authRouter from './routes/auth.routes'
import { errorHandler } from "@brisq/common";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/auth", authRouter);

app.use(errorHandler);

export default app;