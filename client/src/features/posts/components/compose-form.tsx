"use client";

import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { readDraft, saveDraft } from "@/features/posts/utils/draft";
import { Textarea } from "@/components/ui/textarea";
import { characterLimits } from "@/config/platforms";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
import { cn } from "@/lib/utils";
import type { LinkedInStatus, Platform } from "@/types/api";

function getLinkedInNote(status: LinkedInStatus | null): string | null {
  if (status === null) return "Couldn't check your LinkedIn connection.";
  if (status.status === "expired") return "Your LinkedIn connection expired.";
  if (status.status === "not_connected") return "LinkedIn isn't connected yet.";
  return null;
}

type ComposeFormProps = {
  userId: string | null;
  linkedInStatus: LinkedInStatus | null;
};

export function ComposeForm({ userId, linkedInStatus }: ComposeFormProps) {
  const [content, setContent] = useState("");
  const [draftChecked, setDraftChecked] = useState(false);

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

  const limit = characterLimits.LINKEDIN;
  const count = content.length;
  const isOverLimit = count > limit;

  const isLinkedInConnected = linkedInStatus?.status === "connected";
  const linkedInNote = getLinkedInNote(linkedInStatus);

  const [platforms, setPlatforms] = useState<Platform[]>(
    isLinkedInConnected ? ["LINKEDIN"] : [],
  );

  const canPublish =
    content.trim().length > 0 && platforms.length > 0 && !isOverLimit;

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
      </div>

      <div className="flex flex-col items-stretch gap-3 border-t py-4 md:flex-row md:items-center md:justify-end md:gap-4">
        <span
          className={cn(
            "self-end font-mono text-xs text-muted-foreground tabular-nums md:self-auto",
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
  );
}
