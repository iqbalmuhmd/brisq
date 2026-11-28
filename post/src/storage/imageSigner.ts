import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const URL_LIFETIME_SECONDS = 2 * 60 * 60;

export function buildImageSigner(client: S3Client, bucket: string) {
  return {
    signImageUrl: (key: string, now: Date = new Date()) => {
      const signingDate = new Date(
        Math.floor(now.getTime() / 3_600_000) * 3_600_000,
      );
      const command = new GetObjectCommand({ Bucket: bucket, Key: key });

      return getSignedUrl(client, command, {
        expiresIn: URL_LIFETIME_SECONDS,
        signingDate,
      });
    },
  };
}
