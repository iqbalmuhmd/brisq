import { Platform, parsePlatform, BadRequestError } from "@brisq/common";
import { Platform as PrismaPlatform } from "../../generated/prisma/client";

const S3_URL_PATTERN =
  /^https:\/\/[a-z0-9.\-]+\.s3[.\-][a-z0-9-]+\.amazonaws\.com\/.+$/i;

export class PostEntity {
  private readonly _content: string;
  private readonly _platforms: Platform[];
  private readonly _imageUrl?: string;

  constructor(content: unknown, platforms: unknown, imageUrl?: unknown) {
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new BadRequestError("Content cannot be empty");
    }

    if (!Array.isArray(platforms) || platforms.length === 0) {
      throw new BadRequestError("Platforms must be a non-empty array");
    }
    const parsedPlatforms = platforms.map(parsePlatform);

    if (imageUrl !== undefined) {
      if (typeof imageUrl !== "string" || !S3_URL_PATTERN.test(imageUrl)) {
        throw new BadRequestError("imageUrl must be a valid S3 URL");
      }
    }

    this._content = content;
    this._platforms = parsedPlatforms;
    this._imageUrl = imageUrl as string | undefined;
  }

  get content() {
    return this._content;
  }
  get platforms() {
    return this._platforms;
  }
  get imageUrl() {
    return this._imageUrl;
  }

  toPersisted(userId: string) {
    return Object.freeze({
      userId,
      content: this._content,
      imageUrl: this._imageUrl,
    });
  }

  toPlatformStatuses() {
    return this._platforms.map((platform) => ({
      platform: platform as unknown as PrismaPlatform,
    }));
  }
}
