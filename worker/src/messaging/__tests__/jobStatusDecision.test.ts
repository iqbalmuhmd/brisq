import { decideProcessing } from "../jobStatusDecision";

describe("decideProcessing", () => {
  it("proceeds with a PENDING job on its first delivery", () => {
    expect(decideProcessing("PENDING", false)).toBe("PROCEED");
  });

  it("abandons a PENDING job that was redelivered", () => {
    expect(decideProcessing("PENDING", true)).toBe("ABANDON");
  });

  it("skips a SUCCEEDED job, whether or not it was redelivered", () => {
    expect(decideProcessing("SUCCEEDED", false)).toBe("SKIP");
    expect(decideProcessing("SUCCEEDED", true)).toBe("SKIP");
  });

  it("skips a FAILED job, whether or not it was redelivered", () => {
    expect(decideProcessing("FAILED", false)).toBe("SKIP");
    expect(decideProcessing("FAILED", true)).toBe("SKIP");
  });
});
