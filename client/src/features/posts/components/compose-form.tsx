"use client";

import { useEffect, useState } from "react";
import { readDraft, saveDraft } from "@/features/posts/utils/draft";
import { Textarea } from "@/components/ui/textarea";
import { characterLimits } from "@/config/platforms";
import Link from "next/link";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Button } from "@/components/ui/button";
import { paths } from "@/config/paths";
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
    <div>
      <ToggleGroup
        type="multiple"
        value={platforms}
        onValueChange={(value) => setPlatforms(value as Platform[])}
        aria-label="Publish to"
      >
        <ToggleGroupItem
          value={"LINKEDIN" satisfies Platform}
          disabled={!isLinkedInConnected}
        >
          LinkedIn
        </ToggleGroupItem>
      </ToggleGroup>

      {linkedInNote && (
        <p>
          {linkedInNote}{" "}
          <Link href={paths.app.dashboard.getHref()}>Go to dashboard</Link>
        </p>
      )}
      <Textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        disabled={!draftChecked}
        aria-label="Post text"
      />
      <span>
        {count.toLocaleString("en-US")} / {limit.toLocaleString("en-US")}
      </span>

      <Button type="button" disabled={!canPublish}>
        Publish →
      </Button>
    </div>
  );
}
