import { env } from "./env.js";

interface CookieDTO {
  httpOnly: boolean;
  secure: boolean;
  sameSite: "lax" | "strict" | "none";
  maxAge?: number;
  path: string;
}

export const cookieOptions = (minute: number): CookieDTO => {
  return {
    httpOnly: true,
    secure: env.NODE_ENV === "production",
    sameSite: env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: minute * 60 * 1000,
    path: "/",
  };
};

export const clearCookieOptions = (): CookieDTO => {
  const { httpOnly, secure, sameSite, path } = cookieOptions(0);
  return { httpOnly, secure, sameSite, path };
};
