import { BadRequestError } from "@brisq/common";

export function detectImageType(buffer: Buffer): "jpg" | "png" {
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }

  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    return "png";
  }

  throw new BadRequestError(
    "Invalid file type — only JPEG and PNG are accepted",
  );
}
