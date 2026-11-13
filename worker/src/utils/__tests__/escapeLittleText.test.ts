import { escapeLittleText } from "../escapeLittleText";

describe("escapeLittleText", () => {
  it("leaves text without special characters unchanged", () => {
    expect(escapeLittleText("hello world")).toBe("hello world");
  });

  it("escapes a single special character", () => {
    expect(escapeLittleText("Hello @everyone")).toBe("Hello \\@everyone");
  });

  it("escapes several special characters in a real sentence", () => {
    expect(escapeLittleText("Launch #brisq with @abbas (beta)")).toBe(
      "Launch \\#brisq with \\@abbas \\(beta\\)",
    );
  });

  it("escapes a backslash", () => {
    expect(escapeLittleText("C:\\path")).toBe("C:\\\\path");
  });

  it("escapes every special character LinkedIn uses", () => {
    expect(escapeLittleText("\\|{}@[]()<>#*_~")).toBe(
      "\\\\\\|\\{\\}\\@\\[\\]\\(\\)\\<\\>\\#\\*\\_\\~",
    );
  });
});
