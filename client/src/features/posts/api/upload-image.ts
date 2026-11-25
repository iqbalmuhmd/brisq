import { useMutation } from "@tanstack/react-query";

import { apiFetch } from "@/lib/api";
import { type UploadResult } from "@/types/api";

export function uploadImage(file: File): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  return apiFetch<UploadResult>("/assets/upload", {
    method: "POST",
    body: formData,
  });
}

export function useUploadImage() {
  return useMutation({ mutationFn: uploadImage });
}
