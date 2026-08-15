import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function apiBase() {
  const raw = String(
    process.env.NEXT_PUBLIC_API_BASE_URL ||
      process.env.BACKEND_URL ||
      "https://api.peoplesgreen.org",
  )
    .trim()
    .replace(/\/$/, "");
  if (!raw) return "https://api.peoplesgreen.org/v1";
  return raw.endsWith("/v1") ? raw : `${raw}/v1`;
}

function supabaseAdmin() {
  const url = String(
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  ).trim();
  const key = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

/**
 * Durable profile photo upload (Vercel → Supabase Storage).
 * Coolify disk is never used — redeploys cannot wipe these files.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const admin = supabaseAdmin();
  if (!admin) {
    return NextResponse.json(
      {
        message:
          "Photo storage is not configured on the website. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.",
      },
      { status: 503 },
    );
  }

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ message: "Only image files are allowed" }, { status: 400 });
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ message: "Max file size is 10MB" }, { status: 400 });
  }

  const meRes = await fetch(`${apiBase()}/users/me/summary`, {
    headers: { Authorization: auth, Accept: "application/json" },
    cache: "no-store",
  });
  if (!meRes.ok) {
    return NextResponse.json(
      { message: "Could not verify your session. Please log in again." },
      { status: meRes.status === 401 ? 401 : 502 },
    );
  }
  const me = await meRes.json().catch(() => null);
  const userId = Number(me?.user?.id || me?.id || 0);
  if (!userId) {
    return NextResponse.json({ message: "User not found" }, { status: 400 });
  }

  const bucket = process.env.SUPABASE_PHOTOS_BUCKET || "profile-photos";
  const ext =
    (file.type.split("/")[1] || "jpg").replace(/[^a-z0-9]/gi, "") || "jpg";
  const objectPath = `users/${userId}-${Date.now()}.${ext}`;
  const bytes = Buffer.from(await file.arrayBuffer());

  // Ensure public bucket (ignore already-exists)
  await admin.storage.createBucket(bucket, { public: true }).catch(() => null);

  const { error: uploadErr } = await admin.storage
    .from(bucket)
    .upload(objectPath, bytes, {
      contentType: file.type,
      upsert: true,
    });
  if (uploadErr) {
    console.error("[profile-photo] supabase upload failed", uploadErr.message);
    return NextResponse.json(
      { message: "Could not save profile photo. Please try again." },
      { status: 502 },
    );
  }

  const { data: pub } = admin.storage.from(bucket).getPublicUrl(objectPath);
  const publicUrl = pub?.publicUrl;
  if (!publicUrl) {
    return NextResponse.json({ message: "Could not build photo URL" }, { status: 502 });
  }

  const patchRes = await fetch(`${apiBase()}/users/me`, {
    method: "PATCH",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ photoUrl: publicUrl }),
  });
  if (!patchRes.ok) {
    const errText = await patchRes.text().catch(() => "");
    console.error("[profile-photo] patch failed", patchRes.status, errText.slice(0, 300));
    // File is already durable on Supabase — still return URL so UI can show it.
    return NextResponse.json({ photoUrl: publicUrl, warning: "saved_but_profile_update_failed" });
  }

  return NextResponse.json({ photoUrl: publicUrl });
}
