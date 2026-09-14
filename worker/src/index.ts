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
  try {
    await closeRabbitMQ();
    console.log("Worker shut down cleanly");
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    process.exit(0);
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

main();
