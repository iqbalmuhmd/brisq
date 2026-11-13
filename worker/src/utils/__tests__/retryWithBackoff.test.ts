import {
  retryWithBackoff,
  RETRYABLE_STATUSES_UPLOAD,
} from "../retryWithBackoff";
import { JobError } from "../../errors";

describe("retryWithBackoff", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("returns the result when fn succeeds on the first try", async () => {
    const fn = jest.fn().mockResolvedValue("ok");

    const result = await retryWithBackoff(fn, 3, 10);

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries on a retryable JobError and returns the result", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new JobError("Service unavailable", 503))
      .mockResolvedValueOnce("ok");

    const result = await retryWithBackoff(fn, 3, 10);

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("throws immediately when the error is not a JobError", async () => {
    const error = new Error("boom");
    const fn = jest.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, 3, 10)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("throws immediately when the JobError status is not retryable", async () => {
    const error = new JobError("Bad request", 400);
    const fn = jest.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, 3, 10)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("gives up after maxRetries and throws the last error", async () => {
    const error = new JobError("Service unavailable", 503);
    const fn = jest.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, 3, 10)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(4);
  });

  it("throws without waiting when Retry-After is longer than the max wait", async () => {
    const error = new JobError("Too many requests", 429, 9000);
    const fn = jest.fn().mockRejectedValue(error);

    await expect(retryWithBackoff(fn, 3, 10)).rejects.toBe(error);
    expect(fn).toHaveBeenCalledTimes(1);
  });

  it("retries a 500 when given the upload status set", async () => {
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new JobError("Server error", 500))
      .mockResolvedValueOnce("ok");

    const result = await retryWithBackoff(fn, 3, 10, RETRYABLE_STATUSES_UPLOAD);

    expect(result).toBe("ok");
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it("waits for Retry-After instead of the backoff delay", async () => {
    const setTimeoutSpy = jest.spyOn(global, "setTimeout");
    const fn = jest
      .fn()
      .mockRejectedValueOnce(new JobError("Too many requests", 429, 50))
      .mockResolvedValueOnce("ok");

    const result = await retryWithBackoff(fn, 3, 10);

    expect(result).toBe("ok");
    expect(setTimeoutSpy).toHaveBeenCalledWith(expect.any(Function), 50);
  });
});
