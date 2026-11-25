"use client";

import React, { useEffect, useState, useRef } from "react";
import { Check, CircleAlert, ImagePlus, Loader2, X } from "lucide-react";
import { readDraft, saveDraft } from "@/features/posts/utils/draft";
import { Textarea } from "@/components/ui/textarea";
import { characterLimits } from "@/config/platforms";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import type { LinkedInStatus, Platform } from "@/types/api";
import { useUploadImage } from "@/features/posts/api/upload-image";

function getLinkedInNote(status: LinkedInStatus | null): string | null {
  if (status === null) return "Couldn't check your LinkedIn connection.";
  if (status.status === "expired") return "Your LinkedIn connection expired.";
  if (status.status === "not_connected") return "LinkedIn isn't connected yet.";
  return null;
}

type UploadState =
  | { status: "idle" }
  | { status: "uploading" }
  | { status: "uploaded"; key: string }
  | { status: "error"; message: string };

type ComposeFormProps = {
  userId: string | null;
  linkedInStatus: LinkedInStatus | null;
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png"];

export function ComposeForm({ userId, linkedInStatus }: ComposeFormProps) {
  const [content, setContent] = useState("");
  const [draftChecked, setDraftChecked] = useState(false);
  const [upload, setUpload] = useState<UploadState>({ status: "idle" });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const uploadIdRef = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadImage();

  useEffect(() => {
    if (userId !== null) {
      const saved = readDraft(userId);
      if (saved !== null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect -- localStorage only exists after mount
        setContent(saved);
      }
    }
    setDraftChecked(true);
  }, [userId]);

  useEffect(() => {
    if (!draftChecked || userId === null) return;
    saveDraft(userId, content);
  }, [content, draftChecked, userId]);

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

  const limit = characterLimits.LINKEDIN;
  const count = content.length;
  const isOverLimit = count > limit;

  const isLinkedInConnected = linkedInStatus?.status === "connected";
  const linkedInNote = getLinkedInNote(linkedInStatus);

  const [platforms, setPlatforms] = useState<Platform[]>(
    isLinkedInConnected ? ["LINKEDIN"] : [],
  );

  const canPublish =
    content.trim().length > 0 &&
    platforms.length > 0 &&
    !isOverLimit &&
    upload.status !== "uploading" &&
    upload.status !== "error";

  return (
    <div className="border-t-2 border-rule-strong">
      <div className="flex flex-wrap items-center gap-2 py-4">
        <span className="mr-2 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
          To
        </span>
        <ToggleGroup
          type="multiple"
          value={platforms}
          onValueChange={(value) => setPlatforms(value as Platform[])}
          aria-label="Publish to"
        >
          <ToggleGroupItem
            value={"LINKEDIN" satisfies Platform}
            disabled={!isLinkedInConnected}
            className="h-8 gap-2 rounded-full border border-border bg-card pr-3 pl-[9px] text-[13px] font-medium text-foreground hover:bg-card hover:text-foreground disabled:pointer-events-auto disabled:cursor-not-allowed disabled:opacity-40 aria-pressed:bg-card data-[state=on]:border-foreground data-[state=on]:bg-card"
          >
            <span className="flex size-[15px] items-center justify-center rounded-full border border-faint group-data-[state=on]/toggle:border-foreground group-data-[state=on]/toggle:bg-foreground">
              <Check
                strokeWidth={2.2}
                className="hidden size-2.5 text-background group-data-[state=on]/toggle:block"
              />
            </span>
            LinkedIn
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {linkedInNote && (
        <p className="-mt-1 pb-4 text-[13px] text-muted-foreground">
          {linkedInNote}{" "}
          <Link href={paths.app.dashboard.getHref()}>Go to dashboard</Link>
        </p>
      )}

      <div className="border-t pt-5 pb-2">
        <Textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={!draftChecked}
          aria-label="Post text"
          placeholder="What do you want to share?"
          className="min-h-[180px] resize-none rounded-none border-0 bg-transparent p-0 text-xl leading-normal tracking-[-0.01em] text-foreground shadow-none placeholder:text-faint focus-visible:ring-0 disabled:cursor-text disabled:bg-transparent disabled:opacity-100 md:text-xl dark:bg-transparent dark:disabled:bg-transparent"
        />

        {(previewUrl || upload.status === "error") && (
          <div className="flex flex-wrap items-center gap-2 pt-2 pb-3">
            {previewUrl && (
              <div className="relative size-[88px] overflow-hidden rounded-md border">
                {/* eslint-disable-next-line @next/next/no-img-element -- local blob preview, next/image can't optimize it */}
                <img
                  src={previewUrl}
                  alt="Selected image"
                  className="size-full object-cover"
                />
                {upload.status === "uploading" && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 size={18} className="animate-spin text-white" />
                    <span className="sr-only">Uploading…</span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleRemove}
                  aria-label="Remove image"
                  className="absolute top-[5px] right-[5px] z-10 flex size-5 items-center justify-center rounded-full bg-black/60"
                >
                  <X size={9} strokeWidth={1.9} className="text-white" />
                </button>
              </div>
            )}
            {upload.status === "error" && (
              <p
                role="alert"
                className="flex items-center gap-[7px] text-[13px] text-destructive"
              >
                <CircleAlert size={15} strokeWidth={1.8} className="shrink-0" />
                {upload.message}
              </p>
            )}
            {upload.status === "error" && !previewUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemove}
              >
                Dismiss
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3 border-t py-4 md:justify-between">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png"
          onChange={handleImage}
          className="hidden"
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={upload.status !== "idle"}
          className="h-9 gap-2 bg-card px-3.5 text-[13px] font-medium hover:bg-accent dark:bg-card dark:hover:bg-accent"
        >
          <ImagePlus strokeWidth={1.7} className="size-[15px]" />
          Add photo
        </Button>

        <div className="contents md:flex md:items-center md:gap-4">
          <span
            className={cn(
              "ml-auto font-mono text-xs text-muted-foreground tabular-nums md:ml-0",
              isOverLimit && "font-medium text-destructive",
            )}
          >
            {count.toLocaleString("en-US")} / {limit.toLocaleString("en-US")}
          </span>

          <Button
            type="button"
            disabled={!canPublish}
            className="h-11 w-full rounded-md bg-brand px-[18px] text-[13px] font-medium text-white hover:bg-brand-hover disabled:pointer-events-auto disabled:cursor-not-allowed disabled:bg-brand-disabled disabled:opacity-100 md:h-9 md:w-auto"
          >
            Publish →
          </Button>
        </div>
      </div>
    </div>
  );
}
