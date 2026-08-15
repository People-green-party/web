/**
 * Resolve member profile photo URLs for UI.
 * Durable: Supabase Storage + /member-photos on the website.
 * Ephemeral: Coolify /uploads (gone after redeploy) — only used against local API.
 */
export function resolveMemberPhotoUrl(
  photoUrl: string | null | undefined,
  apiBaseUrl?: string | null,
): string | null {
  if (!photoUrl) return null;
  const url = String(photoUrl).trim();
  if (!url) return null;

  // Always allow durable hosts (live admin avatars depend on these).
  if (/supabase\.co\/storage\//i.test(url) || /\/member-photos\//i.test(url)) {
    return url;
  }

  const apiBase = String(apiBaseUrl || "")
    .trim()
    .replace(/\/$/, "")
    .replace(/\/v1$/i, "");
  const isLocalApi = /localhost|127\.0\.0\.1/i.test(apiBase);

  if (url.startsWith("http://") || url.startsWith("https://")) {
    // Absolute Coolify /uploads URLs are usually 404 after redeploy.
    if (!isLocalApi && /\/uploads\//i.test(url) && /api\.peoplesgreen\.org/i.test(url)) {
      return null;
    }
    return url.replace(/\/v1(\/uploads\/)/i, "$1");
  }

  if (url.includes("/uploads/")) {
    if (!isLocalApi) return null;
    if (!apiBase) return null;
    return `${apiBase}${url.startsWith("/") ? url : `/${url}`}`;
  }

  if (!apiBase) return null;
  return `${apiBase}${url.startsWith("/") ? url : `/${url}`}`;
}
