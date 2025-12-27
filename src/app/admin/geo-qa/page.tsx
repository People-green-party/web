"use client";

import { useEffect, useState } from "react";
import { RequireAuth } from "../../components/RequireAuth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

type Qa = {
  loksabhas: number;
  vidhansabhas: number;
  localUnits: number;
  byType: { Ward: number; GramPanchayat: number };
};

export default function GeoQaPage() {
  const [data, setData] = useState<Qa | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${API_BASE}/geo/qa`, { cache: "no-store" })
      .then((r) => r.json())
      .then((d: Qa) => setData(d))
      .catch(() => setError("Failed to load QA counts"));
  }, []);

  return (
    <RequireAuth>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Geo Data QA</h1>
      {error && (
        <div className="mb-4 rounded border border-red-300 bg-red-50 p-3 text-red-800">{error}</div>
      )}
      {!data && !error && <div>Loading...</div>}
      {data && (
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded border p-3">
              <div className="text-sm text-gray-500">Loksabhas</div>
              <div className="text-xl font-semibold">{data.loksabhas}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-sm text-gray-500">Vidhansabhas</div>
              <div className="text-xl font-semibold">{data.vidhansabhas}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-sm text-gray-500">Local Units (total)</div>
              <div className="text-xl font-semibold">{data.localUnits}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-sm text-gray-500">By Type</div>
              <div className="text-xl font-semibold">Ward: {data.byType.Ward}</div>
              <div className="text-xl font-semibold">GP: {data.byType.GramPanchayat}</div>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            These counts are served by the API at <code>/geo/qa</code>. Use this page for simple verification after imports.
          </p>
        </div>
      )}
      </div>
    </RequireAuth>
  );
}
