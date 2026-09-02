import express from "express";
import { errorHandler } from "@brisq/common";

const app = express();

app.use(express.json());

app.use(errorHandler);

export default app;
