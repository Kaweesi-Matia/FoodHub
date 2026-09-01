/**
 * Auth cookie flags that work both locally and on a split deploy
 * (Vercel frontend + Render API).
 *
 * Cross-site cookies require SameSite=None and Secure. SameSite=Strict
 * is silently dropped by the browser when the frontend and API are on
 * different domains, which is why login/session calls fail in production.
 */
export const authCookieOptions = (overrides = {}) => {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
    ...overrides,
  };
};
