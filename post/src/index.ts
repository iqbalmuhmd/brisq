import "./config/env";
import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import prisma from "./config/db";
import { connectRabbitMQ, closeRabbitMQ } from "@brisq/common";

async function main() {
  try {
    await connectDB();
    await connectRabbitMQ();
    app.listen(config.port, () => {
      console.log(`Post service running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

async function shutdown() {
  await closeRabbitMQ();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main();
