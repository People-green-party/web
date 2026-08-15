/**
 * Upload a member profile photo to durable storage (Vercel → Supabase).
 * Falls back to Nest `/users/me/photo` only when the website route is unavailable.
 * Coolify disk is never the source of truth.
 */
export async function uploadMemberPhoto(
  file: File | Blob,
  authHeader: string,
  fileName = "profile.jpg",
): Promise<{ photoUrl: string }> {
  const formData = new FormData();
  formData.append("file", file, fileName);

  // 1) Prefer website route (survives Coolify redeploys forever)
  try {
    const durable = await fetch("/api/profile-photo", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: formData,
    });
    if (durable.ok) {
      const data = await durable.json().catch(() => null);
      if (data?.photoUrl) return { photoUrl: String(data.photoUrl) };
    }
    // 503 = Vercel missing SUPABASE_SERVICE_ROLE_KEY — fall through to API
    if (durable.status !== 503 && durable.status !== 404) {
      let msg = "Photo upload failed";
      try {
        const raw = await durable.text();
        const parsed = JSON.parse(raw);
        msg = Array.isArray(parsed?.message)
          ? parsed.message.join(", ")
          : parsed?.message || msg;
      } catch {
        /* keep default */
      }
      // Still try API fallback below for transient website errors
      console.warn("[uploadMemberPhoto] durable route failed:", durable.status, msg);
    }
  } catch (e) {
    console.warn("[uploadMemberPhoto] durable route error", e);
  }

  // 2) Fallback: Nest API (must have SUPABASE_* on Coolify — never rely on /uploads)
  const { getApiBaseUrl } = await import("./api");
  const formData2 = new FormData();
  formData2.append("file", file, fileName);
  const res = await fetch(`${getApiBaseUrl()}/users/me/photo`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: formData2,
  });
  if (!res.ok) {
    let msg = "Photo upload failed";
    try {
      const raw = await res.text();
      const parsed = JSON.parse(raw);
      msg = Array.isArray(parsed?.message)
        ? parsed.message.join(", ")
        : parsed?.message || raw || msg;
    } catch {
      /* keep */
    }
    throw new Error(msg);
  }
  const data = await res.json().catch(() => null);
  if (!data?.photoUrl) throw new Error("Photo upload failed");
  return { photoUrl: String(data.photoUrl) };
}
