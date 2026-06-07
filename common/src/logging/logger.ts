import winston from "winston";

export function buildLogger(serviceName: string) {
  return winston.createLogger({
    level: process.env.NODE_ENV === "production" ? "info" : "http",
    defaultMeta: { service: serviceName },
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    transports: [
      new winston.transports.Console(),
      ...(process.env.NODE_ENV === "production"
        ? [new winston.transports.File({ filename: `logs/${serviceName}.log` })]
        : []),
    ],
  });
}
