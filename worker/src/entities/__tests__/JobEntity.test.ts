import { parseJobPayload } from "../JobEntity";

describe("parseJobPayload", () => {
  const validJob = {
    jobId: "job-1",
    postId: "post-1",
    userId: "user-1",
    platform: "LINKEDIN",
    content: "Hello LinkedIn",
  };

  it("returns the job when every field is valid", () => {
    expect(parseJobPayload(validJob)).toEqual(validJob);
  });

  it("keeps imageKey when it is present", () => {
    const job = { ...validJob, imageKey: "uploads/user-1/abc.png" };
    expect(parseJobPayload(job)).toEqual(job);
  });

  it("drops fields it does not know about", () => {
    expect(parseJobPayload({ ...validJob, extra: "x" })).toEqual(validJob);
  });

  it("throws when a required field is missing", () => {
    expect(() => parseJobPayload({ ...validJob, postId: undefined })).toThrow();
  });

  it("throws when a field has the wrong type", () => {
    expect(() => parseJobPayload({ ...validJob, content: 42 })).toThrow();
  });

  it("throws on an unknown platform", () => {
    expect(() =>
      parseJobPayload({ ...validJob, platform: "linkedin" }),
    ).toThrow();
  });

  it("throws when imageKey is null", () => {
    expect(() => parseJobPayload({ ...validJob, imageKey: null })).toThrow();
  });

  it("throws when the message is not an object", () => {
    expect(() => parseJobPayload(null)).toThrow();
  });
});
