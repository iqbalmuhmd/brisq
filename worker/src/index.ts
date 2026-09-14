import "./config/env";
import { connectRabbitMQ, closeRabbitMQ } from "@brisq/common";

async function main() {
  try {
    await connectRabbitMQ();
    console.log("Worker service running");
  } catch (error) {
    console.error("Failed to start worker:", error);
    process.exit(1);
  }
}

async function shutdown() {
  await closeRabbitMQ();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main();
