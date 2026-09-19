import { JobError } from "../errors";

const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);
const MAX_WAIT_MS = 8000;

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number,
  baseDelayMs: number,
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (!(err instanceof JobError) || !RETRYABLE_STATUSES.has(err.status)) {
        throw err;
      }
      if (attempt >= maxRetries) throw err;

      const delayMs = err.retryAfterMs ?? baseDelayMs * 2 ** attempt;
      if (delayMs > MAX_WAIT_MS) throw err;
      await sleep(delayMs);
    }
  }
}
