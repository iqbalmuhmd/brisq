import type { CookieOptions } from "express";

export const TOKEN_COOKIE_NAME = "token";

export const tokenCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
};

export const TOKEN_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;
