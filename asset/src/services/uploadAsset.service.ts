import { randomUUID } from "node:crypto";
import { buildStorage } from "../storage/asset.storage";
import { detectImageType } from "../entities/ImageEntity";

type Storage = ReturnType<typeof buildStorage>;

const CONTENT_TYPES = {
  jpg: "image/jpeg",
  png: "image/png",
} as const;

export function buildUploadAssetService(storage: Storage) {
  return async (buffer: Buffer, userId: string) => {
    const type = detectImageType(buffer);
    const contentType = CONTENT_TYPES[type];
    const key = `uploads/${userId}/${randomUUID()}.${type}`;

    await storage.putObject(key, buffer, contentType);

    return { key };
  };
}
