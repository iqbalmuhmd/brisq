import { z } from "zod";
import { BadRequestError } from "../errors";

const userSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
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
