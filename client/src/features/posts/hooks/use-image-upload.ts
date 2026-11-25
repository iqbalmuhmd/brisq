import React, { useEffect, useRef, useState } from "react";
import { useUploadImage } from "@/features/posts/api/upload-image";

export type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "uploaded"; key: string }
  | { status: "error"; message: string };

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export function useImageUpload() {
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  async function handleImage(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setUpload({
        status: "error",
        message: "Only JPEG and PNG images are allowed.",
      });
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setUpload({
        status: "error",
        message: "Image is too large. Max 5 MB.",
      });
      return;
    }

    setPreviewUrl(URL.createObjectURL(file));
    uploadIdRef.current += 1;
    const uploadId = uploadIdRef.current;
    setUpload({ status: "uploading" });

    try {
      const { key } = await uploadMutation.mutateAsync(file);
      if (uploadId !== uploadIdRef.current) return;
      setUpload({ status: "uploaded", key });
    } catch (err) {
      if (uploadId !== uploadIdRef.current) return;
      setUpload({
        status: "error",
        message: err instanceof Error ? err.message : "Upload failed.",
      });
    }
  }

  function handleRemove() {
    uploadIdRef.current += 1;
    setUpload({ status: "idle" });
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return { upload, previewUrl, fileInputRef, handleImage, handleRemove };
}
