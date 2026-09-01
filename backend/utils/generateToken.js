import jwt from "jsonwebtoken";
import { authCookieOptions } from "./cookieOptions.js";

/**
 * Signs a JWT for a given user id and sets it as an httpOnly cookie.
 * Using an httpOnly cookie (rather than localStorage) protects the
 * token from XSS-based theft.
 */
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

  res.cookie(
    "token",
    token,
    authCookieOptions({
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    })
  );

  return token;
};

export default generateToken;
