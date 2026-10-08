import { config } from "./env";
import { s3Client } from "./s3";
import { buildStorage } from "../storage/asset.storage";
import { buildUploadAssetService } from "../services/uploadAsset.service";
import { buildUploadAssetController } from "../controllers/uploadAsset.controller";

const storage = buildStorage(s3Client, config.aws.bucket);

const uploadAssetService = buildUploadAssetService(storage);

export const uploadAssetController =
  buildUploadAssetController(uploadAssetService);
