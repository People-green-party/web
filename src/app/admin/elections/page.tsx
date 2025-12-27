/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getAuthHeader } from "../../../lib/supabaseClient";
import { RequireAuth } from "../../components/RequireAuth";

const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3002";

export default function AdminElectionsPage() {
  const [elections, setElections] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Create form
  const [councilLevel, setCouncilLevel] = useState("CWC");
  const [position, setPosition] = useState("President");
  const [actorUserId, setActorUserId] = useState("1");
  const [reason, setReason] = useState("");

  // Close reasons keyed by election id
  const [closeReasons, setCloseReasons] = useState<Record<number, string>>({});
  const [closeActors, setCloseActors] = useState<Record<number, string>>({});

  // APC per-VidhanSabha creation
  const [loksabhas, setLoksabhas] = useState<Array<{ id: number; name: string }>>([]);
  const [vidhansabhas, setVidhansabhas] = useState<Array<{ id: number; name: string }>>([]);
  const [apcLoksabhaId, setApcLoksabhaId] = useState("");
  const [apcVidhansabhaId, setApcVidhansabhaId] = useState("");
  const [apcActorUserId, setApcActorUserId] = useState("1");
  const [apcReason, setApcReason] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/elections`);
      const data = await res.json();
      setElections(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setError(e?.message || "Failed to load elections");
    } finally {
      setLoading(false);
    }
  };

  const onCreateApc = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const vidhansabhaId = parseInt(apcVidhansabhaId || "0", 10);
      if (!vidhansabhaId) throw new Error("Please select a Vidhan Sabha");
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/admin/elections/apc`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({
          vidhansabhaId,
          actorUserId: parseInt(apcActorUserId || "0", 10),
          reason: apcReason,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setApcReason("");
      setApcLoksabhaId("");
      setApcVidhansabhaId("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Create APC elections failed");
    }
  };

  useEffect(() => {
    const guard = async () => {
      const auth = await getAuthHeader();
      if (!auth?.Authorization) {
        router.push("/join?returnTo=/admin/elections");
        return;
      }
      load();
    };
    guard();
  }, []);

  useEffect(() => {
    const loadLoksabhas = async () => {
      try {
        const res = await fetch(`${API}/geo/loksabhas`);
        const data = await res.json();
        setLoksabhas(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore for now
      }
    };
    loadLoksabhas();
  }, []);

  useEffect(() => {
    const loadVidhansabhas = async () => {
      if (!apcLoksabhaId) { setVidhansabhas([]); setApcVidhansabhaId(""); return; }
      try {
        const res = await fetch(`${API}/geo/loksabhas/${apcLoksabhaId}/vidhansabhas`);
        const data = await res.json();
        setVidhansabhas(Array.isArray(data) ? data : []);
      } catch (e) {
        // ignore for now
      }
    };
    loadVidhansabhas();
  }, [apcLoksabhaId]);

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/admin/elections`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({
          councilLevel,
          position,
          actorUserId: parseInt(actorUserId || "0", 10),
          reason,
        }),
      });
      if (!res.ok) throw new Error(await res.text());
      setReason("");
      await load();
    } catch (e: any) {
      setError(e?.message || "Create failed");
    }
  };

  const onClose = async (id: number) => {
    setError(null);
    try {
      const r = closeReasons[id] || "";
      const a = parseInt(closeActors[id] || "0", 10);
      const auth = await getAuthHeader();
      const res = await fetch(`${API}/admin/elections/${id}/close`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({ reason: r, actorUserId: a }),
      });
      if (!res.ok) throw new Error(await res.text());
      await load();
    } catch (e: any) {
      setError(e?.message || "Close failed");
    }
  };

  return (
    <RequireAuth>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-green-800">Admin: Elections</h1>
            <p className="text-sm text-gray-600 mt-1">Create, manage, and close elections. APC is now a district-wide election (no zones).</p>
          </div>
        </div>

      {loading && <div className="rounded border p-3">Loading…</div>}
      {error && <div className="rounded border border-red-300 bg-red-50 text-red-800 p-3">{error}</div>}

      <form onSubmit={onCreateApc} className="rounded border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-medium mb-3">Create APC Election for a Vidhan Sabha</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-sm text-gray-700">
            Loksabha
            <select value={apcLoksabhaId} onChange={(e) => setApcLoksabhaId(e.target.value)} className="ml-2 border rounded px-2 py-1">
              <option value="">Select</option>
              {loksabhas.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Vidhan Sabha
            <select value={apcVidhansabhaId} onChange={(e) => setApcVidhansabhaId(e.target.value)} className="ml-2 border rounded px-2 py-1" disabled={!apcLoksabhaId}>
              <option value="">Select</option>
              {vidhansabhas.map((v) => (
                <option key={v.id} value={v.id}>{v.name}</option>
              ))}
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Actor User ID
            <input value={apcActorUserId} onChange={(e) => setApcActorUserId(e.target.value)} className="ml-2 border rounded px-2 py-1 w-32" />
          </label>
          <label className="text-sm text-gray-700 flex-1">
            Reason
            <input value={apcReason} onChange={(e) => setApcReason(e.target.value)} className="ml-2 border rounded px-2 py-1 w-full" />
          </label>
          <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Create APC Election</button>
        </div>
      </form>

      <form onSubmit={onCreate} className="rounded border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-medium mb-3">Create Election</h2>
        <div className="flex flex-wrap gap-3 items-end">
          <label className="text-sm text-gray-700">
            Council
            <select value={councilLevel} onChange={(e) => setCouncilLevel(e.target.value)} className="ml-2 border rounded px-2 py-1">
              <option value="CWC">CWC</option>
              <option value="ALC">ALC</option>
              <option value="SLC">SLC</option>
            </select>
          </label>
          <label className="text-sm text-gray-700">
            Position
            <input value={position} onChange={(e) => setPosition(e.target.value)} className="ml-2 border rounded px-2 py-1" />
          </label>
          <label className="text-sm text-gray-700">
            Actor User ID
            <input value={actorUserId} onChange={(e) => setActorUserId(e.target.value)} className="ml-2 border rounded px-2 py-1 w-28" />
          </label>
          <label className="text-sm text-gray-700 flex-1">
            Reason
            <input value={reason} onChange={(e) => setReason(e.target.value)} className="ml-2 border rounded px-2 py-1 w-full" />
          </label>
          <button type="submit" className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded">Create</button>
        </div>
      </form>

      <div className="rounded border border-gray-200 bg-white p-5">
        <h2 className="text-xl font-medium mb-3">Existing Elections</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="px-2 py-2">ID</th>
                <th className="px-2 py-2">Council</th>
                <th className="px-2 py-2">Position</th>
                <th className="px-2 py-2">Status</th>
                <th className="px-2 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {elections.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-2 py-2">{e.id}</td>
                  <td className="px-2 py-2">{e.councilLevel}</td>
                  <td className="px-2 py-2">{e.position}</td>
                  <td className="px-2 py-2">{e.status}</td>
                  <td className="px-2 py-2">
                    <Link href={`/admin/elections/${e.id}/candidates`} className="text-green-700 hover:text-green-800 mr-2">Manage Candidates</Link>
                    <Link href={`/admin/elections/${e.id}/results`} className="text-green-700 hover:text-green-800 mr-2">Results</Link>
                    {e.status === 'Active' && (
                      <span className="inline-flex items-center gap-2">
                        <input
                          placeholder="Reason"
                          value={closeReasons[e.id] || ''}
                          onChange={(ev) => setCloseReasons((s) => ({ ...s, [e.id]: ev.target.value }))}
                          className="border rounded px-2 py-1 w-48"
                        />
                        <input
                          placeholder="Actor User ID"
                          value={closeActors[e.id] || ''}
                          onChange={(ev) => setCloseActors((s) => ({ ...s, [e.id]: ev.target.value }))}
                          className="border rounded px-2 py-1 w-32"
                        />
                        <button onClick={() => onClose(e.id)} className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded">Close</button>
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      </div>
    </RequireAuth>
  );
}
