"use client";

import { useEffect, useState } from "react";
import { RefreshCw } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";

type Qa = {
  loksabhas: number;
  vidhansabhas: number;
  localUnits: number;
  byType: { Ward: number; GramPanchayat: number };
};

export default function GeoQaPage() {
  const [data, setData] = useState<Qa | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const d = await adminFetch<Qa>("geo/qa");
      setData(d);
    } catch (e: any) {
      setData(null);
      setError(e?.message || "Failed to load QA counts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6 font-['Familjen_Grotesk']">
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-[#04330B]">Geo Data QA</h1>
          <p className="text-sm text-[#587E67] mt-1">
            Quick counts to verify Loksabha / Vidhan Sabha / Local Unit imports.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#0D5229] hover:text-[#04330B]"
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-[8px] border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {error}
        </div>
      )}
      {loading && !data && (
        <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-3 text-sm text-[#587E67]">
          Loading…
        </div>
      )}
      {data && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#587E67]">Loksabhas</div>
            <div className="text-2xl font-semibold text-[#04330B]">{data.loksabhas}</div>
          </div>
          <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#587E67]">Vidhansabhas</div>
            <div className="text-2xl font-semibold text-[#04330B]">{data.vidhansabhas}</div>
          </div>
          <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#587E67]">Local Units (total)</div>
            <div className="text-2xl font-semibold text-[#04330B]">{data.localUnits}</div>
          </div>
          <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 shadow-sm">
            <div className="text-sm text-[#587E67]">By Type</div>
            <div className="text-lg font-semibold text-[#04330B]">
              Ward: {data.byType?.Ward ?? 0}
            </div>
            <div className="text-lg font-semibold text-[#04330B]">
              GP: {data.byType?.GramPanchayat ?? 0}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
