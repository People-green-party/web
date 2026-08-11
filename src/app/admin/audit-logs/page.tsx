/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function normalizeApiBaseUrl(base: string) {
  const c = String(base || "").replace(/\/$/, "");
  if (!c) return "http://localhost:3002/v1";
  if (c.endsWith("/v1")) return c;
  return `${c}/v1`;
}

const API = normalizeApiBaseUrl(process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002");

function getAdminToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("adminToken") || sessionStorage.getItem("admin_access_token");
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [limit, setLimit] = useState("100");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = getAdminToken();
      if (!token) {
        router.replace("/admin/login?next=/admin/audit-logs");
        return;
      }
      const res = await fetch(`${API}/audit/logs?limit=${encodeURIComponent(limit)}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || `HTTP ${res.status}`);
      }
      const data = await res.json();
      setLogs(data?.logs || []);
    } catch (e: any) {
      setError(e?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Admin: Audit Logs</h1>
      <div className="mb-3 flex items-center gap-2">
        <label className="text-sm text-gray-700">
          Limit
          <input
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            className="ml-2 border rounded px-2 py-1 w-24"
          />
        </label>
      </div>
      {loading && <div className="rounded border p-3">Loading…</div>}
      {error && <div className="rounded border border-red-300 bg-red-50 text-red-800 p-3">{error}</div>}
      <div className="rounded border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="p-2">ID</th>
              <th className="p-2">Action</th>
              <th className="p-2">Entity</th>
              <th className="p-2">Actor</th>
              <th className="p-2">Reason</th>
              <th className="p-2">When</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className="border-t">
                <td className="p-2">{l.id}</td>
                <td className="p-2">{l.action}</td>
                <td className="p-2">
                  {l.entityType}:{l.entityId}
                </td>
                <td className="p-2">
                  {l.actor?.name || "-"} {l.actor?.phone ? `(${l.actor.phone})` : ""}
                </td>
                <td className="p-2">{l.reason || "-"}</td>
                <td className="p-2">{l.createdAt ? new Date(l.createdAt).toLocaleString() : "-"}</td>
              </tr>
            ))}
            {!loading && logs.length === 0 && (
              <tr>
                <td className="p-3 text-gray-500" colSpan={6}>
                  No logs
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
