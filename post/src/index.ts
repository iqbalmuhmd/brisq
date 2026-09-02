import "./config/env";
import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";
import prisma from "./config/db";

async function main() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`Post service running on port ${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

process.on("SIGINT", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  await prisma.$disconnect();
  process.exit(0);
});

main();
