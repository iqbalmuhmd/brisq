import dotenv from "dotenv";
dotenv.config({ path: ".env.development" });
import app from "./app";
import { config } from "./config/env";

app.listen(config.port, () => {
  console.log(`API Gateway running on port ${config.port}`);
});
