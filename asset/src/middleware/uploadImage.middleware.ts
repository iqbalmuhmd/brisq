import multer, { MulterError } from "multer";
import { Request, Response, NextFunction } from "express";
import { BadRequestError } from "@brisq/common";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export function uploadImage(req: Request, res: Response, next: NextFunction) {
  upload.single("file")(req, res, (err) => {
    if (err instanceof MulterError && err.code === "LIMIT_FILE_SIZE")
      return next(new BadRequestError("File too large — max 5MB"));

    if (err) return next(err);

    next();
  });
}
