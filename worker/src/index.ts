import "./config/env";
import { connectRabbitMQ, closeRabbitMQ, getChannel } from "@brisq/common";
import { startConsuming, getConsumerTag, getInFlight } from "./consumer";

async function main() {
  try {
    await connectRabbitMQ();
    await startConsuming();
    console.log("Worker service running");
  } catch (error) {
    console.error("Failed to start worker:", error);
    process.exit(1);
  }
}

async function shutdown() {
  try {
    const channel = getChannel();
    const tag = getConsumerTag();
    if (tag) await channel.cancel(tag);

    const inFlight = getInFlight();
    if (inFlight) await inFlight;

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
