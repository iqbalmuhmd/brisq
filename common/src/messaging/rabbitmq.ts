import amqp, { ChannelModel, Channel } from "amqplib";

let connection: ChannelModel | null = null;
let channel: Channel | null = null;

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 3000;

export async function connectRabbitMQ(): Promise<void> {
  const url = process.env.RABBITMQ_URL;
  if (!url) throw new Error("RABBITMQ_URL is not set");

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      connection = await amqp.connect(url);
      channel = await connection.createChannel();

      connection.on("error", (err) =>
        console.error("RabbitMQ error:", err.message),
      );
      connection.on("close", () => console.error("RabbitMQ connection closed"));

      await channel.assertExchange("job_results", "fanout", { durable: true });

      await channel.assertExchange("publish_jobs_dlx", "direct", {
        durable: true,
      });
      await channel.assertQueue("publish_jobs_dead", { durable: true });
      await channel.bindQueue(
        "publish_jobs_dead",
        "publish_jobs_dlx",
        "publish_jobs",
      );

      await channel.assertQueue("publish_jobs", {
        durable: true,
        arguments: { "x-dead-letter-exchange": "publish_jobs_dlx" },
      });

      console.log("RabbitMQ connected");
      return;
    } catch (err) {
      console.error(
        `RabbitMQ connect attempt ${attempt}/${MAX_RETRIES} failed`,
      );
      if (attempt === MAX_RETRIES) throw err;
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    }
  }
}

export function getChannel(): Channel {
  if (!channel)
    throw new Error("Channel not initialized — call connectRabbitMQ() first");
  return channel;
}

export async function closeRabbitMQ(): Promise<void> {
  await channel?.close();
  await connection?.close();
}
