import "./config/env";
import app from "./app";
import { config } from "./config/env";
import { connectDB } from "./config/db";

async function main() {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`Auth service running on port ${config.port}`);
  });
}

main();