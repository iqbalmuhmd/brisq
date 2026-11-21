export class JobError extends Error {
  public readonly status: number;
  public readonly retryAfterMs?: number;

  constructor(message: string, status: number, retryAfterMs?: number) {
    super(message);
    this.status = status;
    this.retryAfterMs = retryAfterMs;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
