/**
 * Upload member profile photo to durable Supabase storage.
 *
 * Prefer Nest API on Coolify (already has SUPABASE_SERVICE_ROLE_KEY — used by recent uploads).
 * Optional: Vercel /api/profile-photo if service role is configured there (not required).
 * Never relies on Coolify disk /uploads.
 */
export async function uploadMemberPhoto(
  file: File | Blob,
  authHeader: string,
  fileName = "profile.jpg",
): Promise<{ photoUrl: string }> {
  const { getApiBaseUrl } = await import("./api");

  // 1) Coolify API → Supabase (permanent; no Vercel env needed)
  const formData = new FormData();
  formData.append("file", file, fileName);
  const res = await fetch(`${getApiBaseUrl()}/users/me/photo`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: formData,
  });

  if (res.ok) {
    const data = await res.json().catch(() => null);
    if (data?.photoUrl) {
      const url = String(data.photoUrl);
      // Reject ephemeral Coolify disk URLs — treat as failure and try website route
      if (!/\/uploads\//i.test(url) || /supabase\.co\/storage\//i.test(url)) {
        if (!/api\.peoplesgreen\.org\/uploads\//i.test(url) && !url.startsWith("/uploads/")) {
          return { photoUrl: url };
        }
      }
      if (/supabase\.co\/storage\//i.test(url)) {
        return { photoUrl: url };
      }
    }
  }

  // 2) Optional Vercel route (only works if someone with Vercel access set service role)
  try {
    const form2 = new FormData();
    form2.append("file", file, fileName);
    const durable = await fetch("/api/profile-photo", {
      method: "POST",
      headers: { Authorization: authHeader },
      body: form2,
    });
    if (durable.ok) {
      const data = await durable.json().catch(() => null);
      if (data?.photoUrl) return { photoUrl: String(data.photoUrl) };
    }
  } catch {
    /* ignore */
  }

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
