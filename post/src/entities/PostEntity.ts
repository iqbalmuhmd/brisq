import { Platform, parsePlatform, BadRequestError } from "@brisq/common";
import { Platform as PrismaPlatform } from "../../generated/prisma/client";

const IMAGE_KEY_PATTERN =
  /^uploads\/[^/]+\/[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.(jpg|png)$/i;

export class PostEntity {
  private readonly _content: string;
  private readonly _platforms: Platform[];
  private readonly _imageKey?: string;

  constructor(
    userId: string,
    content: unknown,
    platforms: unknown,
    imageKey?: unknown,
  ) {
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new BadRequestError("Content cannot be empty");
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      throw new BadRequestError("Platforms must be a non-empty array");
    }
    const parsedPlatforms = platforms.map(parsePlatform);

    if (imageKey !== undefined) {
      if (typeof imageKey !== "string" || !IMAGE_KEY_PATTERN.test(imageKey)) {
        throw new BadRequestError(
          "imageKey must match uploads/{userId}/{uuid}.jpg or uploads/{userId}/{uuid}.png",
        );
      }
      if (!imageKey.startsWith(`uploads/${userId}/`)) {
        throw new BadRequestError(
          "imageKey does not belong to the current user",
        );
      }
    }

    this._content = content;
    this._platforms = parsedPlatforms;
    this._imageKey = imageKey as string | undefined;
  }

  get content() {
    return this._content;
  }
  get platforms() {
    return this._platforms;
  }
  get imageKey() {
    return this._imageKey;
  }

  toPersisted(userId: string) {
    return Object.freeze({
      userId,
      content: this._content,
      imageKey: this._imageKey,
    });
  }

  toPlatformStatuses() {
    return this._platforms.map((platform) => ({
      platform: platform as unknown as PrismaPlatform,
    }));
  }
}
