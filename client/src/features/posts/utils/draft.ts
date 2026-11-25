const DRAFT_KEY = "brisq:compose-draft";

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    // storage blocked: nothing to clear
  }
}

export function readDraft(userId: string): string | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (raw === null) return null;

    const draft = JSON.parse(raw);
    if (draft.userId !== userId || typeof draft.content !== "string") {
      clearDraft();
      return null;
    }
    return draft.content;
  } catch {
    clearDraft();
    return null;
  }
}

export function saveDraft(userId: string, content: string) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify({ userId, content }));
  } catch {
    // storage full or blocked.
  }
}
