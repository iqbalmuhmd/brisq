import { z } from "zod";
import { BadRequestError } from "@brisq/common";

const userSchema = z.object({
  name: z
    .string({ error: "Enter your name." })
    .trim()
    .min(1, "Enter your name.")
    .max(50, "Name must be 50 characters or fewer."),
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

export type UserEntityInput = {
  name: string;
  email: string;
  password: string;
};

export class UserEntity {
  private readonly _name: string;
  private readonly _email: string;

  constructor(input: UserEntityInput) {
    const result = userSchema.safeParse(input);
    if (!result.success) {
      throw new BadRequestError(result.error.issues[0].message);
    }
    this._name = result.data.name;
    this._email = result.data.email;
  }

  get name() {
    return this._name;
  }

  get email() {
    return this._email;
  }

  toPersisted(hashedPassword: string) {
    return Object.freeze({
      name: this._name,
      email: this._email,
      password: hashedPassword,
    });
  }
}
