import { NextRequest, NextResponse } from "next/server";
import postgres from "postgres";

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

function isDurablePhotoUrl(photoUrl: string) {
  if (/supabase\.co\/storage\//i.test(photoUrl)) return true;
  if (/\/member-photos\//i.test(photoUrl)) return true;
  return false;
}

/**
 * Admin-only: load durable photoUrl values from Postgres.
 * Does not depend on Coolify static /uploads or Nest select fields.
 *
 * One-time Vercel env: DATABASE_URL (same as API) OR DIRECT_URL.
 */
export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization") || "";
  if (!auth.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const probe = await fetch(
    `${apiBase()}/users/admin/users/search?segment=all&q=&take=1&page=1`,
    {
      headers: { Authorization: auth, Accept: "application/json" },
      cache: "no-store",
    },
  );
  if (!probe.ok) {
    return NextResponse.json(
      { message: "Admin session required" },
      { status: probe.status === 401 ? 401 : 403 },
    );
  }

  let body: { ids?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON" }, { status: 400 });
  }

  const ids = Array.from(
    new Set(
      (Array.isArray(body.ids) ? body.ids : [])
        .map((x) => Number(x))
        .filter((n) => Number.isFinite(n) && n > 0),
    ),
  ).slice(0, 100);

  if (!ids.length) {
    return NextResponse.json({ photos: {} });
  }

  const dbUrl = String(
    process.env.DATABASE_URL || process.env.DIRECT_URL || "",
  ).trim();
  if (!dbUrl) {
    return NextResponse.json(
      {
        message:
          "Set DATABASE_URL on Vercel (same as API) for permanent admin photos — no Coolify redeploy needed after that.",
        photos: {},
      },
      { status: 503 },
    );
  }

  const sql = postgres(dbUrl, {
    max: 1,
    idle_timeout: 5,
    connect_timeout: 10,
    ssl: "require",
    prepare: false,
  });

  try {
    const rows = await sql<{ id: number; photoUrl: string | null }[]>`
      SELECT id, "photoUrl"
      FROM "User"
      WHERE id = ANY(${ids}::int[])
    `;

    const photos: Record<string, string> = {};
    for (const row of rows) {
      const photoUrl = String(row.photoUrl || "").trim();
      if (!photoUrl || !isDurablePhotoUrl(photoUrl)) continue;
      photos[String(row.id)] = photoUrl;
    }
    return NextResponse.json({ photos });
  } catch (err: any) {
    console.error("[member-photos]", err?.message || err);
    return NextResponse.json(
      { message: "Could not load photos from database", photos: {} },
      { status: 502 },
    );
  } finally {
    await sql.end({ timeout: 2 }).catch(() => null);
  }
}
