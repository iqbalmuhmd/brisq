import { z } from "zod";
import { BadRequestError } from "@brisq/common";

const userSchema = z.object({
  email: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Email is required."
          : "Enter a valid email address.",
    })
    .trim()
    .toLowerCase()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),
  password: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Password is required."
          : "Password must be at least 8 characters.",
    })
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters."),
});

export class UserEntity {
  private readonly _email: string;

  constructor(email: string, password: string) {
    const result = userSchema.safeParse({ email, password });
    if (!result.success) {
      throw new BadRequestError(result.error.issues[0].message);
    }
    this._email = result.data.email;
  }

  get email() {
    return this._email;
  }

  toPersisted(hashedPassword: string) {
    return Object.freeze({
      email: this._email,
      password: hashedPassword,
    });
  }
}
