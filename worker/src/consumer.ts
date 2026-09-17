import { getChannel } from "@brisq/common";
import { ConsumeMessage } from "amqplib";
import { handlers } from "./handlers";
import { parseJobPayload } from "./entities/JobEntity";

async function handleMessage(msg: ConsumeMessage | null) {
  if (!msg) return;

  const channel = getChannel();

  try {
    const job = parseJobPayload(JSON.parse(msg.content.toString()));
    await handlers[job.platform](job);
    channel.ack(msg);
  } catch (err) {
    console.error("Job failed:", err);
    channel.nack(msg, false, false);
  }
}

let currentConsumerTag: string | undefined;
let inFlight: Promise<void> | undefined;

export async function startConsuming() {
  const channel = getChannel();
  channel.prefetch(1);

  const { consumerTag } = await channel.consume(
    "publish_jobs",
    (msg) => {
      inFlight = handleMessage(msg).catch((err) => {
        console.error("Unhandled error in handleMessage:", err);
      });
    },
    { noAck: false },
  );

  currentConsumerTag = consumerTag;
}

export function getConsumerTag() {
  return currentConsumerTag;
}

export function getInFlight() {
  return inFlight;
}
