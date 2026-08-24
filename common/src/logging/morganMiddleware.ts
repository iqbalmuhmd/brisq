import morgan from "morgan";
import { Logger } from "winston";

export function buildMorganMiddleware(logger: Logger) {
  return morgan("combined", {
    stream: {
      write: (message: string) => logger.http(message.trim()),
    },
  });
}
