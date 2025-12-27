/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "../../../lib/supabaseClient";
import { RequireAuth } from "../../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

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
      const auth = await getAuthHeader();
      if (!auth?.Authorization) {
        router.push(`/join?returnTo=/admin/audit-logs`);
        return;
      }
      const res = await fetch(`${API}/audit/logs?limit=${encodeURIComponent(limit)}`, { headers: { ...auth } });
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
    <RequireAuth>
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Admin: Audit Logs</h1>
        <div className="mb-3 flex items-center gap-2">
          <label className="text-sm text-gray-700">
            Limit
            <input
              value={limit}
              onChange={(e) => setLimit(e.target.value)}
              className="ml-2 border rounded px-3 py-2 w-28"
            />
          </label>
          <button onClick={load} className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Refresh</button>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}
        <div style={{ overflowX: "auto" }}>
          <table style={{ minWidth: 720, width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th align="left">ID</th>
                <th align="left">When</th>
                <th align="left">Actor</th>
                <th align="left">Action</th>
                <th align="left">Entity</th>
                <th align="left">Reason</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id}>
                  <td>{l.id}</td>
                  <td>{l.createdAt ? new Date(l.createdAt).toLocaleString() : ""}</td>
                  <td>{l.actor ? `${l.actor.name} (${l.actor.phone})` : "-"}</td>
                  <td>{l.action}</td>
                  <td>{l.entityType} #{l.entityId}</td>
                  <td>{l.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </RequireAuth>
  );
}
