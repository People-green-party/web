/**
 * Client-side OTP/dev bypasses only when explicitly enabled and
 * not running a production build.
 */
export function isAuthDevMode(): boolean {
  if (process.env.NODE_ENV === "production") return false;
  return process.env.NEXT_PUBLIC_AUTH_DEV_MODE === "true";
}
