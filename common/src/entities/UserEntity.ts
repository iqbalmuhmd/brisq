import { BadRequestError } from "../errors";

export class UserEntity {
  constructor(
    private email: string,
    private password: string,
  ) {}

  validate(): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new BadRequestError("Invalid email format");
    }
    if (this.password.length < 8) {
      throw new BadRequestError("Password must be at least 8 characters");
    }
  }

  get() {
    return Object.freeze({
      email: this.email,
      password: this.password,
    });
  }
}
