import "./config/env";
import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import prisma from "./config/db";
import { connectRabbitMQ, closeRabbitMQ, getChannel } from "@brisq/common";
import { statusConsumer } from "./config/container";

async function main() {
  try {
    await connectDB();
    await connectRabbitMQ();
    await statusConsumer.start();
    app.listen(config.port, () => {
      console.log(`Post service running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    const tag = statusConsumer.getConsumerTag();
    if (tag) await getChannel().cancel(tag);

    const inFlight = statusConsumer.getInFlight();
    if (inFlight) await inFlight;

    await closeRabbitMQ();
    await prisma.$disconnect();
    console.log("Post service shut down cleanly");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main();
