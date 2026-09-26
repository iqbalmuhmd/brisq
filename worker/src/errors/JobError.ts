export class JobError extends Error {
  public readonly status: number;
  public readonly retryAfterMs?: number;
  public readonly code?: string;

  constructor(
    message: string,
    status: number,
    retryAfterMs?: number,
    code?: string,
  ) {
    super(message);
    this.status = status;
    this.retryAfterMs = retryAfterMs;
    this.code = code;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}
