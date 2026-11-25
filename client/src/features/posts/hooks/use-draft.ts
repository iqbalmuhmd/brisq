import { useEffect, useState } from "react";
import { readDraft, saveDraft } from "@/features/posts/utils/draft";

export function useDraft(userId: string | null) {
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

  return { content, setContent, draftChecked };
}
