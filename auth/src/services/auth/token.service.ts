import jwt from "jsonwebtoken";

export function buildTokenService(secret: string) {
  return {
    sign(userId: string, email: string): string {
      return jwt.sign({ userId, email }, secret, { expiresIn: "7d" });
    },
    verify(token: string) {
      return jwt.verify(token, secret);
    },
  };
}
