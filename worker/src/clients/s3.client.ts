import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { ImageReadError } from "../errors";

export function buildS3Client(client: S3Client, bucket: string) {
  return {
    getObject: async (key: string): Promise<Buffer> => {
      try {
        const response = await client.send(
          new GetObjectCommand({ Bucket: bucket, Key: key }),
        );

        if (!response.Body) {
          throw new ImageReadError(`Failed to read image ${key} from S3`);
        }

        const bytes = await response.Body.transformToByteArray();
        return Buffer.from(bytes);
      } catch (err) {
        if (err instanceof ImageReadError) throw err;

        throw new ImageReadError(
          `Failed to read image ${key} from S3: ${err instanceof Error ? err.name : "unknown"}`,
          err,
        );
      }
    },
  };
}
