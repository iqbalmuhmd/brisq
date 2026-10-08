import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export function buildStorage(client: S3Client, bucket: string) {
  return {
    putObject: async (key: string, buffer: Buffer, contentType: string) => {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Body: buffer,
          Key: key,
          ContentType: contentType,
        }),
      );
    },
  };
}
