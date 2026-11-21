import "./config/env";
import app from "./app";
import { config } from "./config/env";

app.listen(config.port, () => {
  console.log(`Asset service running on port ${config.port}`);
});
