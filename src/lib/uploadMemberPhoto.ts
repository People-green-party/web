/**
 * Upload member profile photo to durable Supabase storage.
 *
 * Prefer Nest API on Coolify (already has SUPABASE_SERVICE_ROLE_KEY).
 * Optional Vercel /api/profile-photo if service role exists there (not required).
 * Never treats Coolify /uploads as success.
 */
export async function uploadMemberPhoto(
  file: File | Blob,
  authHeader: string,
  fileName = "profile.jpg",
): Promise<{ photoUrl: string }> {
  const { getApiBaseUrl } = await import("./api");

  const formData = new FormData();
  formData.append("file", file, fileName);
  const res = await fetch(`${getApiBaseUrl()}/users/me/photo`, {
    method: "POST",
    headers: { Authorization: authHeader },
    body: formData,
  });

  if (res.ok) {
    const data = await res.json().catch(() => null);
    const url = data?.photoUrl ? String(data.photoUrl) : "";
    const isEphemeralUploads =
      !!url && /\/uploads\//i.test(url) && !/supabase\.co\/storage\//i.test(url);
    if (url && !isEphemeralUploads) {
      return { photoUrl: url };
    }
  }

  // Optional: only works if Vercel has SUPABASE_SERVICE_ROLE_KEY (you don't need this)
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
