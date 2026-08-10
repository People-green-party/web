/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ADMIN_API, adminFetch, getAdminToken } from "@/lib/adminApi";

export default function AdminElectionsPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const [councilLevel, setCouncilLevel] = useState("CWC");
  const [position, setPosition] = useState("President");
  const [reason, setReason] = useState("");

  const [closeReasons, setCloseReasons] = useState<Record<number, string>>({});

  const [loksabhas, setLoksabhas] = useState<Array<{ id: number; name: string }>>([]);
  const [vidhansabhas, setVidhansabhas] = useState<Array<{ id: number; name: string }>>([]);
  const [apcLoksabhaId, setApcLoksabhaId] = useState("");
  const [apcVidhansabhaId, setApcVidhansabhaId] = useState("");
  const [apcReason, setApcReason] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminFetch<any[]>("elections");
      setElections(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!getAdminToken()) {
      router.replace("/admin/login");
      return;
    }
    load();
  }, [router]);

  useEffect(() => {
    const loadLoksabhas = async () => {
      try {
        const res = await fetch(`${ADMIN_API}/geo/loksabhas`);
        const data = await res.json();
        setLoksabhas(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };
    loadLoksabhas();
  }, []);

  useEffect(() => {
    const loadVidhansabhas = async () => {
      if (!apcLoksabhaId) {
        setVidhansabhas([]);
        setApcVidhansabhaId("");
        return;
      }
      try {
        const res = await fetch(`${ADMIN_API}/geo/loksabhas/${apcLoksabhaId}/vidhansabhas`);
        const data = await res.json();
        setVidhansabhas(Array.isArray(data) ? data : []);
      } catch {
        // ignore
      }
    };
    loadVidhansabhas();
  }, [apcLoksabhaId]);

  const onCreateApc = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const vidhansabhaId = parseInt(apcVidhansabhaId || "0", 10);
      if (!vidhansabhaId) throw new Error("Please select a Vidhan Sabha");
      if (apcReason.trim().length < 3) throw new Error("Reason must be at least 3 characters");
      await adminFetch("admin/elections/apc", {
        method: "POST",
        body: JSON.stringify({ vidhansabhaId, reason: apcReason.trim() }),
      });
      setApcReason("");
      setApcLoksabhaId("");
      setApcVidhansabhaId("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Create APC elections failed");
    }
  };

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      if (reason.trim().length < 3) throw new Error("Reason must be at least 3 characters");
      await adminFetch("admin/elections", {
        method: "POST",
        body: JSON.stringify({ councilLevel, position, reason: reason.trim() }),
      });
      setReason("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Create failed");
    }
  };

  const onClose = async (id: number) => {
    setError(null);
    try {
      const r = (closeReasons[id] || "").trim();
      if (r.length < 3) throw new Error("Close reason must be at least 3 characters");
      await adminFetch(`admin/elections/${id}/close`, {
        method: "POST",
        body: JSON.stringify({ reason: r }),
      });
      await load();
    } catch (e: any) {
      setError(e?.message || "Close failed");
    }
  };

  return (
    <div className="w-full max-w-full min-w-0 space-y-5 sm:space-y-6 font-['Familjen_Grotesk']">
      <div className="min-w-0">
        <h2 className="text-xl sm:text-2xl font-semibold text-[#04330B]">Elections</h2>
        <p className="text-sm text-[#587E67] mt-1">
          Create, manage, and close elections. APC is a district-wide election (no zones).
        </p>
      </div>

      {loading && (
        <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-3 text-sm text-[#587E67]">
          Loading…
        </div>
      )}
      {error && (
        <div className="rounded-[8px] border border-red-300 bg-red-50 text-red-800 p-3 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={onCreateApc} className="rounded-[8px] border border-[#B9D3C4] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-[#04330B]">Create APC Election for a Vidhan Sabha</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-sm text-[#587E67] flex flex-col gap-1">
            Loksabha
            <select
              value={apcLoksabhaId}
              onChange={(e) => setApcLoksabhaId(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm min-w-[180px]"
            >
              <option value="">Select</option>
              {loksabhas.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[#587E67] flex flex-col gap-1">
            Vidhan Sabha
            <select
              value={apcVidhansabhaId}
              onChange={(e) => setApcVidhansabhaId(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm min-w-[200px] disabled:bg-gray-100"
              disabled={!apcLoksabhaId}
            >
              <option value="">Select</option>
              {vidhansabhas.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.name}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-[#587E67] flex-1 flex flex-col gap-1">
            Reason
            <input
              value={apcReason}
              onChange={(e) => setApcReason(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm w-full"
              placeholder="Audit reason (required)"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-[#0D5229] hover:bg-[#0a4220] text-white px-4 py-2 rounded-[8px] text-sm font-semibold"
          >
            Create APC Election
          </button>
        </div>
      </form>

      <form onSubmit={onCreate} className="rounded-[8px] border border-[#B9D3C4] bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-3 text-[#04330B]">Create Election</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-sm text-[#587E67] flex flex-col gap-1">
            Council
            <select
              value={councilLevel}
              onChange={(e) => setCouncilLevel(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm min-w-[140px]"
            >
              <option value="CWC">CWC</option>
              <option value="ALC">ALC</option>
              <option value="SLC">SLC</option>
            </select>
          </label>
          <label className="text-sm text-[#587E67] flex flex-col gap-1">
            Position
            <input
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm min-w-[160px]"
            />
          </label>
          <label className="text-sm text-[#587E67] flex-1 flex flex-col gap-1">
            Reason
            <input
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="mt-1 border border-[#B9D3C4] rounded-[6px] px-3 py-2 text-sm w-full"
              placeholder="Audit reason (required)"
              required
            />
          </label>
          <button
            type="submit"
            className="bg-[#0D5229] hover:bg-[#0a4220] text-white px-4 py-2 rounded-[8px] text-sm font-semibold"
          >
            Create
          </button>
        </div>
      </form>

      <div className="rounded-[8px] border border-[#B9D3C4] bg-white p-4 sm:p-5 shadow-sm min-w-0">
        <h2 className="text-lg font-semibold mb-3 text-[#04330B]">Existing Elections</h2>
        <div className="overflow-x-auto w-full max-w-full overscroll-x-contain">
          <table className="w-full text-sm min-w-[640px]">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2 text-[#587E67] font-semibold">ID</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Council</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Position</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Status</th>
                <th className="px-2 py-2 text-[#587E67] font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((e) => (
                <tr key={e.id} className="border-t border-[#E4F2EA]">
                  <td className="px-2 py-2">{e.id}</td>
                  <td className="px-2 py-2">{e.councilLevel}</td>
                  <td className="px-2 py-2">{e.position}</td>
                  <td className="px-2 py-2">{e.status}</td>
                  <td className="px-2 py-2">
                    <Link
                      href={`/admin/elections/${e.id}/candidates`}
                      className="text-[#0D5229] hover:text-[#04330B] mr-2 font-semibold"
                    >
                      Manage Candidates
                    </Link>
                    <Link
                      href={`/admin/elections/${e.id}/results`}
                      className="text-[#0D5229] hover:text-[#04330B] mr-2 font-semibold"
                    >
                      Results
                    </Link>
                    {e.status === "Active" && (
                      <span className="inline-flex items-center gap-2">
                        <input
                          placeholder="Close reason"
                          value={closeReasons[e.id] || ""}
                          onChange={(ev) =>
                            setCloseReasons((s) => ({ ...s, [e.id]: ev.target.value }))
                          }
                          className="border border-[#B9D3C4] rounded-[6px] px-3 py-1.5 w-48 text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => onClose(e.id)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-[8px] text-sm font-semibold"
                        >
                          Close
                        </button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!loading && elections.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-2 py-6 text-[#587E67]">
                    No elections yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
