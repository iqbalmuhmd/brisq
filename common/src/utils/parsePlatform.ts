import { Platform } from "../types/Platform";
import { BadRequestError } from "../errors";

export function parsePlatform(value: unknown): Platform {
  if (typeof value !== "string") {
    throw new BadRequestError("Invalid platform");
  }

  const normalized = value.toUpperCase();

  if (!Object.values(Platform).includes(normalized as Platform)) {
    throw new BadRequestError(`Invalid platform: ${value}`);
  }

  return normalized as Platform;
}